import { ResBodyBase, ResponseBase } from 'routers/base/response'
import { RequestBase } from 'routers/base/request'

type UserSigninReqBody = {
    mobile: string;
    email: string;
    authname: string;
    pw: string;
}

type UserSigninQuery = UserSigninReqBody

export type UserSigninRequest = RequestBase<never, ResBodyBase, UserSigninReqBody, UserSigninQuery>
export type UserSigninResponse = ResponseBase

type UserSignupReqBody = {
    nickname: string;
    mobile: string;
    gender: 'male' | 'female'
    email: string;
    description: string;
    pw: string;
}

type UserSignupQuery = UserSignupReqBody

export type UserSignupRequest = RequestBase<never, ResBodyBase, UserSignupReqBody, UserSignupQuery>
export type UserSignupResponse = ResponseBase

type UserSearchReqQuery = {
    key: string
}

export type UserSearchRequest = RequestBase<never, never, never, UserSearchReqQuery>
export type UserSearchResponse = ResponseBase

type UserInviteParams = {
    uid: string
}

export type UserInviteRequest = RequestBase<UserInviteParams, never, never, never>
export type UserInviteResponse = ResponseBase

type GalleriesParams = {
    uid: string;
}

type GalleriesQuery = {
    begin: string;
}

export type GalleriesRequest = RequestBase<GalleriesParams, never, never, GalleriesQuery>
export type GalleriesResponse = ResponseBase
// export type FunctionType = {
//     name: string;
//     imgurl: string;
//     active: boolean;
//     compoName: string;
//     bgurl: string;
// }

// export type ChannelType = {
//     name: string; // channel name
//     imgurl: string; // avatar
//     active: boolean;
//     functions: FunctionType[]
// }

// export type UserToClient = {
//     _id: string;
//     nickname: string;
//     description: string;
//     avatar: string;
//     mobile: string;
//     family: FamilyToClient;
//     email: string;
//     uniqueToken: string;
//     functions: string;
// }

// export const familyFuncsDefault = [
//     {
//         name: '家庭首页',
//         imgurl: 'img/homepage-default-48x48.png',
//         active: true,
//         compoName: 'CFamilyIndex',
//         bgurl: 'img/overlay-default.png'
//     },
//     {
//         name: '家庭群聊',
//         active: false,
//         imgurl: 'img/chat-default-48x48.png',
//         compoName: 'CFamilyChat',
//         bgurl: 'img/overlay-default.png'
//     },
//     {
//         name: '动态',
//         active: false,
//         imgurl: 'img/moments-default-48x48.png',
//         compoName: 'CFamilyMoments',
//         bgurl: 'img/overlay-default.png'
//     },
//     {
//         name: '相册',
//         active: false,
//         imgurl: 'img/photos-default-48x48.png',
//         compoName: 'CFamilyPhotos',
//         bgurl: 'img/overlay-default.png'
//     }
// ]
