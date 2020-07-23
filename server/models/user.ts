import { Document, Schema, model, DocumentQuery, Model, QueryPopulateOptions } from 'mongoose'
import token, { uid } from 'rand-token'
import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'

import { isMobile, isEmail } from '../base/utils'
import { RequestBase } from '../routers/base/request'
import { ResponseBase } from '../routers/base/response'
import { IUserDoc, IUserLean } from './types/user_types'
import { UserSigninResponse, UserSigninRequest } from 'routers/api/types/user_types'
import GalleryModel from './gallery'
import { GalleryToCreate } from './types/gallery_types'

const UserSchema: Schema = new Schema(
    {
        nickname: {
            type: String,
            trim: true,
            required: true,
        },
        mobile: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            validate: [(v: string) => isMobile(v), "手机号格式不正确"],
        },
        description: {
            type: String
        },
        gender: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            index: {
                unique: true,
                //@ts-ignore
                partialFilterExpression: { email: { $exists: true } },
            },
            validate: [(v: string) => isEmail(v), "邮箱格式不正确"],
        },
        avatar: {
            type: String
        },
        avatarThumb: {
            type: String
        },
        pw: {
            type: String,
            trim: true,
            required: true,
            match: [/^.{6,12}$/, "密码格式为6-12个任意字符"],
        },
        family: {
            type: Schema.Types.ObjectId,
            ref: "Family",
        },
        galleries: [{
            type: Schema.Types.ObjectId,
            ref: "Gallery",
        }],
        functions: {
            type: String, // json string
        },
        followers: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        followings: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        uniqueToken: String,
        salt: String,
    },
    {
        timestamps: true,
    }
)

UserSchema.pre<IUserDoc>('save', function (next) {
    if (!this.uniqueToken) {
        this.uniqueToken = token.generate(16)
    }

    if (!this.avatar) {
        const rand = Math.floor(Math.random() * 12)
        this.avatar = this.gender === 'female' ? `img/avatar-default-female-${rand}-48x48.png` : `img/avatar-default-male-${rand}-48x48.png`
    }
    if (!this.avatarThumb) {
        this.avatarThumb = this.avatar
    }
    if (!this.functions) {
        this.functions = `[{ "name": "个人首页", "active": false, "imgurl": "${this.avatar}", "compoName": "CPersonalIndex", "bgurl": "img/overlay-default.png" }, { "name": "私聊", "imgurl": "img/chat-default-48x48.png", "compoName": "CPersonalChat", "bgurl": "img/overlay-default.png" }, { "name": "动态", "imgurl": "img/moments-default-48x48.png", "compoName": "CPersonalMoments", "bgurl": "img/overlay-default.png" }, { "name": "相册", "imgurl": "img/photos-default-48x48.png", "compoName": "CPersonalPhotos", "bgurl": "img/overlay-default.png" }]`
    }
    next()
})

// UserSchema.pre<IUserDoc>("save", async function (next) {
//     if (!this.galleries || this.galleries.length === 0) {
//         const galery: GalleryToCreate = new GalleryToCreate('DEFAULT GALLERY')
//         const gdoc = await GalleryModel.create<GalleryToCreate>(galery)
//         this.galleries.push(gdoc.id)
//         next()
//     } else {
//         next()
//     }
// })

UserSchema.pre<IUserDoc>('save', function (next) {
    if (this.salt || !this.pw) {
        next()
        return
    }

    const _thisUser = this

    bcrypt.genSalt( function (err, salt) {
        if (err) {
            next(err)
            return
        }
        bcrypt.hash(_thisUser.pw, salt, function (err, hash) {
            if (err) {
                next(err)
                return
            }
            _thisUser.pw = hash
            _thisUser.salt = salt
            next()
        })
    })
})

export type UserSession = {
    _id: string;
    nickname: string;
    mobile: string;
    pw: string;
    fid?: string;
    fname?: string;
}

// export type AuthResult = {
//     success: boolean,
//     code?: 'NotFound' | 'PwError'
//     userDoc?: IUserDoc,
//     msg?: string
// }

UserSchema.statics.authenticate = function (uniqueKey: 'mobile' | 'email' | 'id', value: string, authpw: string, hashed: boolean, populate: boolean) {
    let docQuery: DocumentQuery<IUserLean | null, IUserDoc>
    let conditions

    if (uniqueKey === 'id') {
        docQuery = UserModel.findById(value, null, { lean: true })
    } else {
        conditions = uniqueKey === 'mobile' ? { mobile: value } : { email: value }
        docQuery = UserModel.findOne(conditions, null, { lean: true })
    }
    if (populate) {
        const familyPop: QueryPopulateOptions = {
            path: 'family',
            populate: [{
                path: 'members',
            }, {
                path: 'galleries',
                populate: {
                    path: 'imgs'
                }
            }]
        }
        const followPop: QueryPopulateOptions = {
            path: 'followers followings',
            select: '_id avatar avatarThumb description members'
        }
        const galleryPop: QueryPopulateOptions = {
            path: 'galleries',
            populate: {
                path: 'imgs'
            }
        }
        docQuery.populate([familyPop, followPop, galleryPop])
    }
    return docQuery
            .then(async userLean => {
                if (!userLean) {
                    throw new Error('用户不存在')
                }
                if (hashed) {
                    if (userLean.pw !== authpw) {
                        throw new Error('密码不正确')
                    }
                    return userLean
                } else {
                    const identical = await bcrypt.compare(authpw, userLean.pw)
                    if (!identical) {
                        throw new Error('密码不正确')
                    }
                    return userLean
                }
            })
}

UserSchema.statics.signin = function (uniqueKey: 'mobile' | 'email' | 'id', value: string, authpw: string, hashed: boolean, req: RequestBase, res: ResponseBase) {
    return UserModel.authenticate(uniqueKey, value, authpw, hashed, true)
    .then(uLean => {
        if (req.session) {
            req.session.user = {
                _id: uLean._id.toString(),
                nickname: uLean.nickname,
                mobile: uLean.mobile,
                pw: uLean.pw,
                fid: uLean.family ? uLean.family._id.toString() : '',
            }
            res.cookie('uid', uLean._id.toString())
        }
        delete uLean.pw
        delete uLean.salt
        return uLean
    })
}

type SignoutResult = {
    success: boolean,
    code?: 'NoLoggedUser'
}

UserSchema.statics.signout = function (req: RequestBase, res: ResponseBase) {
    let result: SignoutResult
    if (!req.session || !req.session.user) {
        result  = { success: true, code: 'NoLoggedUser' }
    } else {
        result = { success: true }
        req.session.user = undefined
        res.clearCookie('uid')
    }
    return result
}

interface IUserModel extends Model<IUserDoc> {
    authenticate (uniqueKey: 'mobile' | 'email' | 'id', value: string, authpw: string, hashed: boolean, populate: boolean) : Promise<IUserLean>
    signin(uniqueKey: 'mobile' | 'email' | 'id', value: string, authpw: string, hashed: boolean, req: UserSigninRequest, res: UserSigninResponse): Promise<IUserLean>
    signout(req: RequestBase, res: ResponseBase): SignoutResult
}

const UserModel = model<IUserDoc, IUserModel>('User', UserSchema)

export default UserModel
