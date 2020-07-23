import axios from 'axios'

import { FamilyClient } from './family_types'
import ColorLog from '../../util/ColorLog'
import { GalleryClient, ImageClient } from './gallery_types'

const uLog = new ColorLog('client:userStore')

export class FunctionType {
    constructor(public name: string, public imgurl: string, public active: boolean, public compoName: string, public bgurl: string) {}
}

export class ChannelType {
    constructor(
        public _id: string,
        public name: string, // channel name
        public avatar: string, // avatar
        public avatarThumb: string, // avatar缩略图
        public active: boolean,
        public functions: FunctionType[]
    ) {}
}

export const familyChannelDefault: ChannelType = {
    _id: '',
    name: '无名之家',
    avatar: 'img/avatar-default-home-48x48.png',
    avatarThumb: 'img/avatar-default-home-48x48.png',
    active: true,
    functions: [
        {
            name: '家庭首页',
            imgurl: 'img/homepage-default-48x48.png',
            active: true,
            compoName: 'CFamilyIndex',
            bgurl: 'img/overlay-default.png'
        },
        {
            name: '家庭群聊',
            active: false,
            imgurl: 'img/chat-default-48x48.png',
            compoName: 'CFamilyChat',
            bgurl: 'img/overlay-default.png'
        },
        {
            name: '动态',
            active: false,
            imgurl: 'img/moments-default-48x48.png',
            compoName: 'CFamilyMoments',
            bgurl: 'img/overlay-default.png'
        },
        {
            name: '相册',
            active: false,
            imgurl: 'img/photos-default-48x48.png',
            compoName: 'CFamilyPhotos',
            bgurl: 'img/overlay-default.png'
        }
    ]
}

const userChannelDefault: ChannelType = {
    _id: 'anonymous',
    name: '无名之人',
    active: false,
    avatar: 'img/avatar-default-48X48.png',
    avatarThumb: 'img/avatar-default-48X48.png',
    functions: [
        {
            name: '个人首页',
            active: true,
            imgurl: 'img/avatar-default-48X48.png',
            compoName: 'CPersonalIndex',
            bgurl: 'img/overlay-default.png'
        },
        {
            name: '私聊',
            active: false,
            imgurl: 'img/chat-default-48x48.png',
            compoName: 'CPersonalChat',
            bgurl: 'img/overlay-default.png'
        },
        {
            name: '动态',
            active: false,
            imgurl: 'img/moments-default-48x48.png',
            compoName: 'CPersonalMoments',
            bgurl: 'img/overlay-default.png'
        },
        {
            name: '相册',
            active: false,
            imgurl: 'img/photos-default-48x48.png',
            compoName: 'CPersonalPhotos',
            bgurl: 'img/overlay-default.png'
        }
    ]
}

export const channelsDefault: ChannelType[] = [familyChannelDefault, userChannelDefault]

export class UserClient {
    constructor(
        public _id = 'anonymous',
        public nickname = '无名',
        public description = '',
        public avatar = 'img/avatar-default-48x48.png',
        public avatarThumb = 'img/avatar-default-48x48.png',
        public mobile = '',
        public family = new FamilyClient(),
        public email = '',
        public galleries: GalleryClient[] = [],
        public functions = '',
        public channels = channelsDefault,
        public role = ''
    ) {}

    freshAll(userServer) {
        // uLog.info(`freshAll >> ${JSON.stringify(userServer, null, 4)}`)
        Object.assign(this, userServer)
        this.freshChannels()
    }

    freshFamily(familyServer) {
        // uLog.info(`freshFamily >> ${JSON.stringify(familyServer, null, 4)}`)
        this.family = familyServer
        this.freshChannels()
    }

    freshGalleries(galleriesServer) {
        // uLog.info(`freshGallery >> ${JSON.stringify(galleriesServer, null, 4)}`)
        if (!galleriesServer) {
            return
        }
        if (Array.isArray(galleriesServer) && galleriesServer.length === 0) {
            return
        }
        if (!Array.isArray(galleriesServer) && !(galleriesServer.family || galleriesServer.user)) {
            return
        }
        let galleriesToUpdate
        let isFamily
        let isSelf
        let isArray = false
        if (Array.isArray(galleriesServer)) {
            isFamily = Boolean(galleriesServer[0].family)
            isSelf = Boolean(galleriesServer[0].user === this._id)
            isArray = true
        } else {
            isFamily = Boolean(galleriesServer.family)
            isSelf = Boolean(galleriesServer.user === this._id)
        }
        if (isFamily) {
            galleriesToUpdate = this.family.galleries
        } else if (isSelf) {
            galleriesToUpdate = this.galleries
        } else {
            const member = this.family.members.find(m => m._id === galleriesServer[0].user)
            if (!member) {
                return
            }
            if (member.galleries.length > 0 && !member.galleries[0].imgs) {
                // 说明galleries没有populated
                member.galleries = []
            }
            galleriesToUpdate = member.galleries
        }

        if (isArray) {
            if (galleriesToUpdate.length === 0 || galleriesServer[0].createdAt > galleriesToUpdate[galleriesToUpdate.length - 1].createdAt) {
                galleriesToUpdate.push(...galleriesServer)
            } else if (galleriesServer[galleriesServer.length - 1].createdAt < galleriesToUpdate[0].createdAt) {
                galleriesToUpdate.unshift(...galleriesServer)
            } else {
                throw new Error('画册没有正确排序，或者包含重复的画册')
            }
        } else {
            // 检查是否是已经存在的画册
            const gallery = galleriesToUpdate.find(g => g._id === galleriesServer._id)
            if (gallery) {
                // 存在的话就替换
                Object.assign(gallery, galleriesServer)
            } else if (galleriesToUpdate.length === 0 || galleriesServer.createdAt > galleriesToUpdate[galleriesToUpdate.length - 1].createdAt) {
                galleriesToUpdate.push(galleriesServer)
            } else if (galleriesServer.createdAt < galleriesToUpdate[0].createdAt) {
                galleriesToUpdate.unshift(galleriesServer)
            } else {
                throw new Error('画册没有正确排序，或者包含重复的画册')
            }
        }
    }

    freshMember(userServer) {
        // uLog.info(`freshMember >> ${JSON.stringify(userServer, null, 4)}`)
        const member = this.family.members.findIndex(m => m._id === userServer._id)
        if (member === -1) {
            this.family.members.push(userServer)
        } else {
            this.family.members.splice(member, 1, userServer)
        }
        this.freshChannels()
    }

    private freshChannels() {
        // clear first
        this.channels = []

        this.channels.push(this.makeFamilyChannel())
        this.channels.push(this.makeUserChannel(this))
        if (this.family.members) {
            this.family.members.forEach(m => {
                if (m._id !== this._id) {
                    this.channels.push(this.makeUserChannel(m))
                }
            })
        }
    }
    updateFamilyGalleries() {
        if (!this.family._id) {
            return
        }
        const galleries = this.family.galleries
        let begin = 0
        if (galleries.length > 0) {
            begin = galleries[galleries.length - 1].createdAt
        }
        axios
            .get(`/api/family/${this.family._id}/galleries?begin=${begin}`)
            .then(response => {
                this.freshGalleries(response.data.data)
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    updateUserGalleries(uid: string) {
        let galleries
        if (uid === this._id) {
            galleries = this.galleries
        } else {
            const member = this.family.members.find(m => m._id === uid)
            if (!member) {
                return
            }
            galleries = member.galleries
            if (!Array.isArray(galleries)) {
                galleries = member.galleries = []
            }
            if (Array.isArray(galleries) && galleries.length > 0 && !galleries[0].imgs) {
                galleries = member.galleries = []
            }
        }
        let begin = 0
        if (galleries.length > 0) {
            begin = galleries[galleries.length - 1].createdAt
        }
        axios
            .get(`/api/user/${uid}/galleries?begin=${begin}`)
            .then(response => {
                this.freshGalleries(response.data.data)
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    private makeFamilyChannel(): ChannelType {
        if (!this.family || !this.family.functions) {
            return familyChannelDefault
        }
        return {
            _id: this.family._id,
            name: this.family.name || '无名',
            active: true,
            avatar: this.family.avatar,
            avatarThumb: this.family.avatarThumb,
            functions: JSON.parse(this.family.functions) as FunctionType[]
        }
    }
    private makeUserChannel(user: UserClient): ChannelType {
        if (!user.functions) {
            return userChannelDefault
        }
        const channel = {
            _id: user._id,
            name: user.nickname,
            active: false,
            avatar: user.avatar,
            avatarThumb: user.avatarThumb,
            functions: JSON.parse(user.functions) as FunctionType[]
        }
        if (user._id === this._id) {
            const chat = channel.functions.findIndex(f => f.compoName === 'CPersonalChat')
            if (chat !== -1) {
                channel.functions.splice(chat, 1)
            }
        }
        return channel
    }

    static RandomImgs(galleries: GalleryClient[], count: number) {
        if (!galleries || galleries.length === 0) {
            return []
        }
        const allImgs: ImageClient[] = []
        galleries.forEach(g => {
            if (!g.imgs) {
                return
            }
            g.imgs.forEach(img => {
                if (!img.title) {
                    img.title = g.title
                }
                if (!img.description) {
                    img.description = g.description
                }
                allImgs.push(img)
            })
        })
        if (allImgs.length <= count) {
            return allImgs
        }
        const randImgs: ImageClient[] = []
        for (let index = 0; index < count; index++) {
            const length = allImgs.length
            const rand = Math.floor(Math.random() * length)
            randImgs.push(allImgs[rand])
            allImgs.splice(rand, 1)
        }

        return randImgs // TODO 实现随机图片
    }
}
