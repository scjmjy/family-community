import { Document } from 'mongoose'
import { FamilyToClient } from './family_types'
import { GalleryToClient } from './gallery_types'
import { UserSigninRequest, UserSignupRequest } from 'routers/api/types/user_types'

export class UserToCreate {
    constructor(
        public nickname = '',
        public description = '',
        public mobile = '',
        public email: string | undefined  = undefined,
        public pw = '',
        public gender: 'male' | 'female' | '' = '',
        public avatar = '',
        public avatarThumb = ''
    ) {}

    static fromRequest(req: UserSignupRequest) {
        return new UserToCreate(req.body.nickname, req.body.description, req.body.mobile, req.body.email || undefined, req.body.pw, req.body.gender)
    }
}

export class UserToClient extends UserToCreate {
    constructor(
        public _id = '',
        public galleries: GalleryToClient[] = [],
        public family: FamilyToClient = new FamilyToClient(),
        public functions = '',
        nickname = '',
        description = '',
        mobile = '',
        email = '',
        gender: 'male' | 'female' | '' = '',
        avatar = '',
        avatarThumb = ''
    ) {
        super(nickname, description, mobile, email, '', gender, avatar, avatarThumb)
    }
}
export type IUserLean = UserToClient & { uniqueToken: string; salt: string; pw: string }
export type IUserDoc = Document & IUserLean
