import { NextFunction, Router } from 'express'
import HttpCodes from 'http-status-codes'

import { isMobile, isEmail } from '../../base/utils'
import { AppErrorCode, AppError } from '../../base/AppError'
import AppLog from '../../base/AppLog'

import { ResponseBase, ResBodyBase } from '../base/response'
import { RequestBase } from '../base/request'

import UserModel from '../../models/user'
import FamilyModel from '../../models/family'
import { UserToCreate, IUserDoc } from '../../models/types/user_types'

import { UserSigninRequest, UserSigninResponse, UserSignupRequest, UserSignupResponse, UserSearchRequest, UserSearchResponse, UserInviteRequest, UserInviteResponse, GalleriesRequest, GalleriesResponse} from './types/user_types'
import { FilterQuery, QueryFindOptions, QueryPopulateOptions } from 'mongoose'

const userLog = new AppLog('server:router:user')

const UserRoutes = {
    signin(req: UserSigninRequest, res: UserSigninResponse, next: NextFunction) {
        userLog.info('signin --开始')

        let mobile = req.query.mobile || req.body.mobile
        let email = req.query.email || req.body.email
        if (!mobile && !email) {
            const authname = req.query.authname || req.body.authname
            if (isMobile(authname)) {
                mobile = authname
            } else if (isEmail(authname)) {
                email = authname
            }
        }

        let pw = req.query.pw || req.body.pw
        let hashed = false

        let ismobile = undefined
        if (mobile) {
            ismobile = true
        } else if (email) {
            ismobile = false
        }

        if (ismobile === undefined) {
            // 没有提供账号信息，那么查看是否session里有该用户
            if (req.session && req.session.user) {
                ismobile = true
                mobile = req.session.user.mobile
                pw = req.session.user.pw
                hashed = true
            }
        }

        if (ismobile === undefined || pw === undefined) {
            res.status(HttpCodes.BAD_REQUEST).json({ success: false, code: HttpCodes.BAD_REQUEST, msg: '没有提供账号或密码' })
            userLog.warn('signin --结束 [没有提供账号或密码]')
            return
        }

        UserModel.signin(ismobile ? 'mobile' : 'email', ismobile ? mobile : email, pw, hashed, req, res)
            .then((uLean) => {
                let status = { success: true, code: AppErrorCode.OK, data: uLean }
                res.status(HttpCodes.OK).json(status)
                userLog.info(`signin --结束 [成功]`)
            })
            .catch((err) => {
                const status: ResBodyBase = { success: false, code: AppErrorCode.ERROR_UNKNOWN, msg: err.message }
                res.status(HttpCodes.OK).json(status)
                userLog.warn(`signin --结束 [失败：${err.message}]`)
            })
    },
    signout(req: RequestBase, res: ResponseBase, next: NextFunction) {
        userLog.info('signout --开始')
        let result = UserModel.signout(req, res)
        let status: ResBodyBase
        if (result.success) {
            status = { success: true, code: HttpCodes.OK, msg: '退出成功' }
            userLog.info('signout --结束 [成功]')
        } else {
            status = { success: false, code: HttpCodes.INTERNAL_SERVER_ERROR, msg: '退出失败' }
            userLog.warn('signout --结束 [失败]')
        }
        res.status(status.code).json(status)
    },
    signup(req: UserSignupRequest, res: UserSignupResponse, next: NextFunction) {
        const userToCreate = UserToCreate.fromRequest(req)

        userLog.info(`signup --开始 [${userToCreate.nickname}]`)
        UserModel.create<UserToCreate>(userToCreate)
            .then((udoc) => {
                res.redirect(HttpCodes.TEMPORARY_REDIRECT, './signin')
                userLog.info('signup --结束 [成功]')
            })
            .catch((err) => {
                if (err.code === 11000) {
                    // dumplicated key
                    const status: ResBodyBase = {
                        code: AppErrorCode.USER_ALREADY_EXISTS,
                        success: false,
                        msg: `用户已存在`,
                    }
                    userLog.warn('signup --结束 [失败，用户已存在]')
                    res.status(HttpCodes.OK).json(status)
                } else {
                    // 未知错误
                    next(err)
                    userLog.warn('signup --结束 [失败]')
                }
            })
    },
    search(req: UserSearchRequest, res: UserSearchResponse, next: NextFunction) {
        if (!req.session || !req.session.user) {
            next()
            return
        }
        const keyword = req.query.key as string
        userLog.info(`search---开始[${keyword}]`)
        if (!keyword) {
            res.status(HttpCodes.OK).json({ code: HttpCodes.BAD_REQUEST, success: false, msg: '没有提供搜索关键词' })
        } else {
            const regexp = new RegExp(keyword, 'i')
            const conditions: FilterQuery<IUserDoc> = {
                $or: [{ nickname: regexp }],
            }
            const projection = '_id nickname description avatar avatarThumb family'
            const options: QueryFindOptions = {
                limit: 50,
                sort: { name: 1 },
                populate: {
                    path: 'family',
                    select: '_id name avatar avatarThumb description',
                },
                lean: true,
            }
            UserModel.find(conditions, projection, options)
                .then((udocs) => {
                    const status: ResBodyBase = {
                        code: HttpCodes.OK,
                        success: true,
                        data: udocs,
                    }
                    res.status(HttpCodes.OK).json(status)
                    userLog.info(`search---结束[${udocs.length}个结果]`)
                })
                .catch((err) => {
                    res.status(HttpCodes.OK).json({ code: HttpCodes.INTERNAL_SERVER_ERROR, success: false, msg: `搜索失败：${err.message}` })
                })
        }
    },
    invite(req: UserInviteRequest, res: UserInviteResponse, next: NextFunction) {
        if (!req.session || !req.session.user) {
            next()
            return
        }

        userLog.info('invite---开始')
        const uid = req.params.uid
        const fid = req.session.user.fid
        const galleryPop: QueryPopulateOptions = {
            path: 'galleries',
            populate: {
                path: 'imgs',
            },
        }
        UserModel.findById(uid)
            .select('-pw -salt')
            .populate(galleryPop)
            .then(async (udoc) => {
                if (!udoc) {
                    throw new AppError(AppErrorCode.RESOURCE_NOT_FOUND, '没有找到对应的用户')
                }
                if (udoc.family) {
                    throw new AppError(AppErrorCode.DUMPLICATED, '对方已经有了家庭')
                }
                udoc.family = fid as any
                udoc = await udoc.save()
                // 更新user的family
                const update = {
                    $push: {
                        members: uid,
                    },
                }
                const fdoc = await FamilyModel.findByIdAndUpdate(fid, update, { projection: { _id: 1 } }).exec()
                if (!fdoc) {
                    throw new AppError(AppErrorCode.DATABASE_ERROR, '把用户添加到家庭失败')
                }
                // const familyToClient = new FamilyToClient(fdoc._id, fdoc.name, fdoc.avatar, fdoc.members, fdoc.functions)
                const status: ResBodyBase = {
                    code: HttpCodes.OK,
                    success: true,
                    data: udoc,
                }
                res.status(status.code).json(status)
                userLog.info('invite---成功')
            })
            .catch((err) => {
                const status: ResBodyBase = {
                    code: HttpCodes.INTERNAL_SERVER_ERROR,
                    success: false,
                    msg: err.message,
                }
                res.status(HttpCodes.OK).json(status)
                userLog.info(`invite---失败[${err.message}]`)
            })
    },
    galleries(req:GalleriesRequest, res:GalleriesResponse, next: NextFunction) {
        if (!req.session || !req.session.user) {
            next()
            return
        }
        userLog.info('galleries---开始')

        const uid = req.params.uid
        const begin = req.query.begin || 0
        const populate = {
            path: 'galleries',
            match: { createdAt: { $gt: begin } },
            populate: {
                path: 'imgs'
            }
        }
        UserModel.findById(uid)
            .populate(populate)
            .then((udoc) => {
                if (!udoc) {
                    throw new Error('获取相册失败：没有该用户')
                }
                const status: ResBodyBase = {
                    code: HttpCodes.OK,
                    success: true,
                    data: udoc.galleries
                }
                res.status(HttpCodes.OK).json(status)
                userLog.info(`galleries---成功[${udoc.galleries.length}条]`)
            })
            .catch((err) => {
                const status: ResBodyBase = {
                    code: HttpCodes.INTERNAL_SERVER_ERROR,
                    success: false,
                    msg: err.message,
                }
                res.status(HttpCodes.OK).json(status)
                userLog.error(`galleries---失败[${err.message}]`)
            })
    }
}

const userRouter = Router()
userRouter.post('/signin', UserRoutes.signin)
userRouter.get('/signout', UserRoutes.signout)
userRouter.post('/signup', UserRoutes.signup)
userRouter.get('/search', UserRoutes.search)
userRouter.get('/:uid/galleries', UserRoutes.galleries)
userRouter.get('/:uid/invite', UserRoutes.invite)

export default userRouter
