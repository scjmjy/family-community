import m from 'mongoose'
import token from 'rand-token'
import { IFamilyDoc } from './types/family_types'
import { GalleryToCreate } from './types/gallery_types'
import GalleryModel from './gallery'

const FamilySchema = new m.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String
    },
    members: [{
        type: m.Schema.Types.ObjectId,
        ref: 'User'
    }],
    avatar: {
        type: String,
        trim: true
    },
    avatarThumb: {
        type: String,
        trim: true
    },
    galleries: [{
        type: m.Schema.Types.ObjectId,
        ref: 'Gallery'
    }],
    functions: {
        type: String // json string
    },
    followers: [{
        type: m.Schema.Types.ObjectId,
        ref: 'Family'
    }],
    followings: [{
        type: m.Schema.Types.ObjectId,
        ref: 'Family'
    }],
    uniqueToken: String
}, {
    timestamps: true
})

FamilySchema.pre<IFamilyDoc>('save', function (next) {
    if (!this.uniqueToken) {
        this.uniqueToken = token.generate(16)
    }
    if (!this.avatar) {
        this.avatar = 'img/avatar-default-home-48x48.png'
    }
    if (!this.avatarThumb) {
        this.avatarThumb = this.avatar
    }
    if (!this.functions) {
        this.functions = '[{ "name": "家庭首页", "imgurl": "img/homepage-default-48x48.png", "active": true, "compoName": "CFamilyIndex", "bgurl": "img/overlay-default.png" }, { "name": "家庭群聊", "imgurl": "img/chat-default-48x48.png", "compoName": "CFamilyChat", "bgurl": "img/overlay-default.png" }, { "name": "动态", "imgurl": "img/moments-default-48x48.png", "compoName": "CFamilyMoments", "bgurl": "img/overlay-default.png" }, { "name": "相册", "imgurl": "img/photos-default-48x48.png", "compoName": "CFamilyPhotos", "bgurl": "img/overlay-default.png" }]'
    }
    next()
})
// FamilySchema.pre<IFamilyDoc>('save', async function (next) {
//     if (!this.galleries || this.galleries.length === 0) {
//         const galery: GalleryToCreate = new GalleryToCreate('DEFAULT GALLERY')
//         const gdoc = await GalleryModel.create<GalleryToCreate>(galery)
//         this.galleries.push(gdoc.id)
//         next()
//     } else {
//         next()
//     }
// })
const FamilyModel = m.model<IFamilyDoc>('Family', FamilySchema)
export default FamilyModel
