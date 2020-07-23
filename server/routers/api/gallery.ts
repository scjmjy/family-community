import { NextFunction, Router } from 'express'
import HttpCodes from 'http-status-codes'

import AppLog from '../../base/AppLog'

import GalleryModel from '../../models/gallery'
import { GalleryToCreate } from '../../models/types/gallery_types'
import FamilyModel from '../../models/family'
import UserModel from '../../models/user'
import ImageModel from '../../models/image'
import { ImageToCreate } from '../../models/types/image_types'

import { ResBodyBase } from '../../routers/base/response'

import { GalleryCreateRequest, GalleryCreateResponse } from './types/gallery_types'
import { imgUplForm } from './types/image_types'

const gLog = new AppLog('server:router:gallery')

const GalleryRoutes = {
    create(req: GalleryCreateRequest, res: GalleryCreateResponse, next: NextFunction) {
        if (!req.session || !req.session.user) {
            next(new Error('没有登录的用户'))
            return
        }
        gLog.info('create---开始')
        const galleryToCreate = GalleryToCreate.fromRequest(req)

        GalleryModel.create<GalleryToCreate>(galleryToCreate)
            .then(async (gdoc) => {
                if (gdoc.family) {
                    // 属于家庭的相册gallery
                    const fdoc = await FamilyModel.findByIdAndUpdate(gdoc.family, {
                        $push: {
                            galleries: gdoc._id,
                        },
                    }).exec()

                    if (!fdoc) {
                        throw new Error('相册保存到家庭失败了：没有找到这个家庭')
                    }
                } else {
                    // 属于个人的相册gallery
                    const udoc = await UserModel.findByIdAndUpdate(gdoc.user, {
                        $push: {
                            galleries: gdoc._id,
                        },
                    }).exec()
                    if (!udoc) {
                        throw new Error('相册保存到个人失败了：没有找到这个用户')
                    }
                }
                if (req.files && req.files.length > 0) {
                    // 保存照片
                    const imgsToStore: ImageToCreate[] = ImageToCreate.fromGlleryReq(req, gdoc._id)
                    const idocs = await ImageModel.create<ImageToCreate>(imgsToStore)
                    gdoc.imgs = []
                    for (const idoc of idocs) {
                        gdoc.imgs.push(idoc)
                    }
                    gdoc = await gdoc.save()
                }
                const status: ResBodyBase = {
                    code: HttpCodes.OK,
                    success: true,
                    data: gdoc,
                }
                res.status(status.code).json(status)
                gLog.info('create---成功')
            })
            .catch((err) => {
                const status: ResBodyBase = {
                    code: HttpCodes.INTERNAL_SERVER_ERROR,
                    success: true,
                    msg: err.message,
                }
                res.status(status.code).json(status)
                gLog.error(`create---失败[${err.message}]`)
            })
    },
}

const galleryRouter = Router()
galleryRouter.post('/create', imgUplForm, GalleryRoutes.create)

export default galleryRouter
