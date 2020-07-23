import { Document } from 'mongoose'
import { ImageToClient } from './image_types'
import { GalleryCreateRequest } from 'routers/api/types/gallery_types'

type IImageInGallery = Pick<ImageToClient, '_id' | 'name' | 'url' | 'urlThumb' | 'title' | 'description'>

export
class GalleryToCreate {
    constructor(
        public title = '',
        public description = '',
        public family: string | undefined = undefined,
        public user: string | undefined = undefined
    ) {}

    static fromRequest(req: GalleryCreateRequest) {
        let family, user
        if (req.query.belong === 'family') {
            family = req.session?.user?.fid
        } else {
            user = req.session?.user?._id
        }
        return new GalleryToCreate(req.body.title, req.body.description, family, user)
    }
}

export
class GalleryToClient extends GalleryToCreate {
    constructor(
        public _id = '',
        public createdAt = 0,
        public imgs: IImageInGallery[] = [],
        title = '',
        description = '',
        family = '',
        user = ''
    ) {
        super(title, description, family, user)
    }
}

export type IGalleryDoc = GalleryToClient & Document
