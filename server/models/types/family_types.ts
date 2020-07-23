import { Document } from 'mongoose'
import { GalleryToClient } from './gallery_types'
import { FamilyCreateRequest } from 'routers/api/types/family_types'

export
class MemberType {
    constructor(public _id = '', public nickname = '', public avatar = '', public avatarThumb = '', public functions = '') {}
}

export
class FamilyToCreate {
    constructor(public name = '', public description = '', public avatar = '', public avatarThumb = '', public members: MemberType[] | string[] = []) {}

    static fromRequest(req: FamilyCreateRequest) {
        return new FamilyToCreate(req.body.familyname, req.body.description, req.file.path, req.file.thumbPath, [new MemberType(req.session?.user?._id)])
    }
}
export
class FamilyToClient extends FamilyToCreate {
    constructor(
        public _id = '',
        public functions = '',
        public galleries: GalleryToClient[] = [],
        name = '',
        description = '',
        avatar = '',
        avatarThumb = '',
        members: MemberType[] | string[] = []
    ) {
        super(name, description, avatar, avatarThumb, members)
    }
}

export type IFamilyDoc = Document & FamilyToClient & { uniqueToken: string }
