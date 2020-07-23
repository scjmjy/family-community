import { UserClient } from './user_types'

type UserLikes = Pick<UserClient, '_id'|'avatar'|'avatarThumb'|'nickname'|'description'|'family'>
type IGalleryInImage = Pick<GalleryClient, '_id'|'name'|'title'>

export
class ImageClient {
    constructor(
        public _id = '',
        public name: string,
        public title: string,
        public description: string,
        public url: string,
        public urlThumb: string,
        public gallery: IGalleryInImage,
        public createdAt = 0,
        public likes: UserLikes[] = []
    ) {}
}

export
class GalleryClient {
    constructor(
        public _id = '',
        public name = '',
        public title = '',
        public description = '',
        public family = '',
        public user = '',
        public imgs: ImageClient[] = [],
        public createdAt = 0
    ) {}
}
