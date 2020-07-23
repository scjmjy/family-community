import { NextFunction, Router } from 'express'
import HttpCodes from 'http-status-codes'

import AppLog from '../../base/AppLog'
import { AppErrorCode } from '../../base/AppError'

import { ImageToCreate } from '../../models/types/image_types'
import GalleryModel from '../../models/gallery'
import ImageModel from '../../models/image'

import { ResBodyBase } from '../../routers/base/response'

import { ImageUploadRequest, ImageUploadResponse, imgUplForm } from './types/image_types'

const iLog = new AppLog('server:router:image')

const ImageRoutes = {
    upload(req: ImageUploadRequest, res: ImageUploadResponse, next: NextFunction) {
        if (!req.session || !req.session.user) {
            next(new Error('没有登录的用户'))
            return
        }
        iLog.info('upload image---开始')
        if (!req.files || req.files.length === 0) {
            next(new Error('没有发现图片文件'))
            return
        }
        const imgsToStore: ImageToCreate[] = ImageToCreate.fromRequest(req)

        GalleryModel.findById(req.params.gid)
            .populate('imgs')
            .then(async (gdoc) => {
                if (!gdoc) {
                    throw new Error('对应的gallery不存在')
                }
                const idocs = await ImageModel.create<ImageToCreate>(imgsToStore)
                if (!gdoc.imgs) {
                    gdoc.imgs = []
                }
                for (const idoc of idocs) {
                    gdoc.imgs.push(idoc)
                }

                gdoc = await gdoc.save()
                const status: ResBodyBase = {
                    code: AppErrorCode.OK,
                    success: true,
                    data: gdoc,
                }
                res.status(HttpCodes.OK).json(status)
                iLog.info('upload image---结束[成功]')
            })
            .catch((err) => {
                const status: ResBodyBase = {
                    code: AppErrorCode.ERROR_UNKNOWN,
                    success: false,
                    msg: err.message,
                }
                res.status(HttpCodes.OK).json(status)
                iLog.error('upload image---结束[失败]')
            })
    },
}

const imageRouter = Router()
imageRouter.post('/upload/:gid', imgUplForm, ImageRoutes.upload)
// imageRouter.post("/user/upload/:gid", imgUplForm, ImageRoutes.userUpload)
// imageRouter.delete('/family/:iid', ImageRoutes.userUpload)

export default imageRouter
