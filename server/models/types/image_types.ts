import { Document } from 'mongoose'
import { UserToClient } from './user_types'
import { ImageUploadRequest } from 'routers/api/types/image_types'
import { GalleryCreateRequest } from 'routers/api/types/gallery_types'

type IUserInImage = Pick<UserToClient, '_id' | 'avatar' | 'nickname'>

export class ImageToCreate {
    constructor(
        public name: string,
        public title: string,
        public description: string,
        public url: string,
        public urlThumb: string,
        public gallery: string
    ) {}

    static fromRequest(req: ImageUploadRequest) {
        const imgs: ImageToCreate[] = []
        const files = req.files as Express.Multer.File[]
        files.forEach(imgfile => {
            imgs.push(new ImageToCreate(
                imgfile.originalname || '',
                req.body.title,
                req.body.description,
                imgfile.path || '',
                imgfile.thumbPath,
                req.params.gid
            ))
        })
        return imgs
    }
    static fromGlleryReq(req: GalleryCreateRequest, gid: string) {
        const imgs: ImageToCreate[] = []
        const files = req.files as Express.Multer.File[]
        files.forEach((imgfile) => {
            imgs.push(
                new ImageToCreate(
                    imgfile.originalname || '',
                    req.body.title,
                    req.body.description,
                    imgfile.path || '',
                    imgfile.thumbPath,
                    gid
                )
            )
        })
        return imgs
    }
}

export class ImageToClient extends ImageToCreate {
    constructor(
        public _id = '',
        public createdAt = 0,
        public likes: IUserInImage[] = [],
        name = '',
        title = '',
        description = '',
        url = '',
        urlThumb = '',
        gallery = ''
    ) {
        super(name, title, description, url, urlThumb, gallery)
    }

    static fromDoc(imgDoc: IImageDoc) {
        const imgToClient = new ImageToClient()
        return Object.assign(imgToClient, imgDoc)
    }
}

export type IImageDoc = ImageToClient & Document
