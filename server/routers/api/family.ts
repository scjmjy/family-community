import { NextFunction, Router } from 'express'
import HttpCodes from 'http-status-codes'
import path from 'path'
import { QueryFindOptions, FilterQuery } from 'mongoose'
import multer from 'multer'

import AppLog from '../../base/AppLog'
import { make_YMD_path } from '../../base/utils'
import { AppError, AppErrorCode } from '../../base/AppError'

import { ResBodyBase } from '../base/response'
import ImgStorage, { ImgStorageOptions } from '../base/multipart/ImgStorage'
import { RequestBase } from '../base/request'

import FamilyModel from '../../models/family'
import UserModel from '../../models/user'
import { IFamilyDoc, FamilyToCreate, MemberType } from '../../models/types/family_types'

import { FamilyCreateRequest, FamilyCreateResponse, FamilySearchRequest, FamilySearchResponse, FamilyJoinRequest, FamilyJoinResponse, GalleriesRequest, GalleriesResponse } from './types/family_types'

const fLog = new AppLog('server:router:family')

const FamilyRoutes = {
    create(req: FamilyCreateRequest, res: FamilyCreateResponse, next: NextFunction) {
        if (!req.session || !req.session.user) {
            next()
            return
        }

        if (req.session.user.fid) {
            fLog.error('create---用户已经有了一个家庭了')
            next()
            return
        }

        fLog.info('create---开始')

        const familyToCreate = FamilyToCreate.fromRequest(req)
        FamilyModel.create<FamilyToCreate>(familyToCreate)
            .then(async (fdoc) => {
                const udoc = await UserModel.findByIdAndUpdate(req.session?.user?._id, { family: fdoc._id }).exec()
                if (!udoc) {
                    throw new Error('没有找到创建该家庭的用户')
                }
                fdoc.members[0] = { _id: udoc._id, nickname: udoc.nickname, avatar: udoc.avatar, avatarThumb: udoc.avatarThumb, functions: udoc.functions}
                const status: ResBodyBase = {
                    code: HttpCodes.OK,
                    success: true,
                    data: fdoc,
                }
                fLog.info('create---结束 [成功]')
                res.status(status.code).json(status)
                if (req.session && req.session.user) {
                    req.session.user.fid = fdoc._id
                    req.session.user.fname = fdoc.name
                }
            })
            .catch((err) => {
                const status: ResBodyBase = {
                    code: HttpCodes.INTERNAL_SERVER_ERROR,
                    success: false,
                    msg: '创建家庭失败',
                }
                fLog.error(`create---结束 [${err.message}]`)
                res.status(status.code).json(status)
            })
    },
    search (req: FamilySearchRequest, res: FamilySearchResponse, next: NextFunction) {
        if (!req.session || !req.session.user) {
            next()
            return
        }
        const keyword = req.query.key as string
        fLog.info(`search---开始[${keyword}]`)
        if (!keyword) {
            res.status(HttpCodes.OK).json({ code: HttpCodes.BAD_REQUEST, success: false, msg: '没有提供搜索关键词' })
        } else {
            const regexp = new RegExp(keyword, 'i')
            const conditions: FilterQuery<IFamilyDoc> = {
                $or:[
                    {name: regexp}
                ]
            }
            const projection = '_id name description avatar avatarThumb members'
            const options: QueryFindOptions = {
                limit: 50,
                sort: { name: 1 },
                populate: {
                    path: 'members',
                    select: '_id nickname avatar avatarThumb description',
                },
                lean: true
            }
            FamilyModel.find(conditions, projection, options)
                .then(fdocs => {
                    const status: ResBodyBase = {
                        code: HttpCodes.OK,
                        success: true,
                        data: fdocs
                    }
                    res.status(HttpCodes.OK).json(status)
                    fLog.info(`search---结束[${fdocs.length}个结果]`)
                }).catch(err => {
                    res.status(HttpCodes.OK).json({ code: HttpCodes.INTERNAL_SERVER_ERROR, success: false, msg: `搜索失败：${err.message}` })
                })
        }
    },
    join (req: FamilyJoinRequest, res: FamilyJoinResponse, next: NextFunction) {
        if (!req.session || !req.session.user) {
            next()
            return
        }
        if (req.session.user.fid) {
            fLog.warn('已经有家庭了，不能加入其他家庭')
            next()
            return
        }
        fLog.info('join---开始')
        const fid = req.params.fid
        const uid = req.session.user._id
        const update = {
            $push: {
                members: {
                    _id: req.session.user._id,
                    nickname: '',
                    avatar: '',
                    avatarThumb: '',
                    functions: ''
                }
            }
        }
        FamilyModel.findByIdAndUpdate(fid, update, {
                new: true,
                lean: true
            })
            .populate([{
                path: 'members',
                select: '-salt -pw'
            },{
                path: 'galleries',
                populate: {
                    path: 'imgs',
                }
            }])
            .exec()
            .then(async fdoc => {
                if (!fdoc) {
                    throw new AppError(AppErrorCode.RESOURCE_NOT_FOUND, '没有找到对应的家庭')
                }
                    // 更新user的family
                const udoc = await UserModel.findByIdAndUpdate(uid, {family: fdoc._id}, { projection: {_id: 1} }).exec()
                if (!udoc) {
                    throw new AppError(AppErrorCode.DATABASE_ERROR, '更新用户的家庭信息失败')
                }
                // const familyToClient = new FamilyToClient(fdoc._id, fdoc.name, fdoc.avatar, fdoc.members, fdoc.functions)
                const status: ResBodyBase = {
                    code: HttpCodes.OK,
                    success: true,
                    data: fdoc,
                }
                res.status(status.code).json(status)
                if (req.session && req.session.user) {
                    req.session.user.fid = fdoc._id.toString()
                    req.session.user.fname = fdoc.name
                }
                fLog.info('join---成功')
            })
            .catch(err => {
                const status: ResBodyBase = {
                    code: HttpCodes.INTERNAL_SERVER_ERROR,
                    success: false,
                    msg: err.message
                }
                if (err instanceof AppError) {
                    status.code = err.code === AppErrorCode.RESOURCE_NOT_FOUND ? HttpCodes.NOT_FOUND : HttpCodes.INTERNAL_SERVER_ERROR
                }
                res.status(status.code).json(status)
                fLog.info(`join---失败[${err.message}]`)
            })
    },
    galleries(req:GalleriesRequest, res:GalleriesResponse, next: NextFunction) {
        if (!req.session || !req.session.user) {
            next()
            return
        }
        fLog.info('galleries---开始')

        const fid = req.params.fid
        const begin = req.query.begin || 0
        const populate = {
            path: 'galleries',
            match: { createdAt: { $gt: begin } },
            populate: {
                path: 'imgs'
            }
        }
        FamilyModel.findById(fid)
            .populate(populate)
            .then((fdoc) => {
                if (!fdoc) {
                    throw new Error('获取相册失败：没有该家庭')
                }
                const status: ResBodyBase = {
                    code: HttpCodes.OK,
                    success: true,
                    data: fdoc.galleries
                }
                res.status(HttpCodes.OK).json(status)
                fLog.info(`galleries---成功[${fdoc.galleries.length}条]`)
            })
            .catch((err) => {
                const status: ResBodyBase = {
                    code: HttpCodes.INTERNAL_SERVER_ERROR,
                    success: false,
                    msg: err.message,
                }
                res.status(HttpCodes.OK).json(status)
                fLog.error(`galleries---失败[${err.message}]`)
            })
    }
}

class AvatarOpts implements ImgStorageOptions {
    constructor(public width = 200, public height = 200, public allways = false, public ymd = make_YMD_path()) {}
    fulldir(req: RequestBase, file: Express.Multer.File) {
        const avatardir = path.join(req.app.get('ENV-STATIC-DIR'), req.app.get('ENV-FAMILY-AVATAR-DIR'))
        const fulldir = path.join(avatardir, this.ymd)
        return fulldir
    }
    basename(req: RequestBase, file: Express.Multer.File) {
        if (!req.session || !req.session.user || !req.session.user._id) {
            throw new Error('用户不存在')
        }
        return req.session.user._id
    }
    urldir(req: RequestBase, file: Express.Multer.File) {
        return path.join(req.app.get('ENV-FAMILY-AVATAR-DIR'), this.ymd)
    }
}

const avatarForm = multer({
    storage: new ImgStorage(new AvatarOpts()),
    limits: {
        files: 1,
        fileSize: 1024 * 1024 * 10,
    },
}).single('avatar')

const familyRouter = Router()
familyRouter.post('/create', avatarForm, FamilyRoutes.create)
familyRouter.get('/search', FamilyRoutes.search)
familyRouter.get('/:fid/galleries', FamilyRoutes.galleries)
familyRouter.get('/:fid/join', FamilyRoutes.join)
// familyRouter.post('/:uid/leave', FamilyRoutes.leave)
// familyRouter.get('/:uid/change/:fid', FamilyRoutes.change)

export default familyRouter
