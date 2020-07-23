import { UserClient } from './user_types'
import { GalleryClient } from './gallery_types'

export class FamilyClient {
    constructor (public _id = '',
        public name = '无名之家',
        public avatar = 'img/avatar-default-home-48x48.png',
        public avatarThumb = 'img/avatar-default-home-48x48.png',
        public functions = '',
        public members: UserClient[] = [],
        public galleries: GalleryClient[] = []) {

    }
}
