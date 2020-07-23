import path from 'path'
import multer from 'multer'

import { ResBodyBase, ResponseBase } from '../../base/response'
import { make_YMD_path } from '../../../base/utils'
import { RequestBase } from '../../../routers/base/request'
import ImgStorage, { ImgStorageOptions } from '../../base/multipart/ImgStorage'

type ReqBody = {
    title: string;
    description: string;
}

type Params = {
    gid: string
}

export type ImageUploadRequest = RequestBase<Params, ResBodyBase, ReqBody, never>
export type ImageUploadResponse = ResponseBase

export class ImgUplOpts implements ImgStorageOptions {
    constructor(public width = 400, public height = 300, public allways = false, public ymd = make_YMD_path()) {}
    fulldir(req: RequestBase, file: Express.Multer.File) {
        const uploaddir = path.join(req.app.get('ENV-STATIC-DIR'), req.app.get('ENV-IMGUPLOAD-DIR'))
        const fulldir = path.join(uploaddir, this.ymd)
        return fulldir
    }
    basename(req: RequestBase, file: Express.Multer.File) {
        return file.originalname + Date.now().toString()
    }
    urldir(req: RequestBase, file: Express.Multer.File) {
        return path.join(req.app.get('ENV-IMGUPLOAD-DIR'), this.ymd)
    }
}

export const imgUplForm = multer({
    storage: new ImgStorage(new ImgUplOpts()),
    limits: {
        files: 9,
        fileSize: 1024 * 1024 * 10,
    },
}).array('imgfiles')
