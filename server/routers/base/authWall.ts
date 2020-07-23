import { NextFunction } from 'express'
import { ResponseBase, ResBodyBase } from './response'
import { RequestBase } from './request'
import { UNAUTHORIZED } from 'http-status-codes'

import AppLog from '../../base/AppLog'

const wallLog = new AppLog('server:authwall')

export default (req: RequestBase, res: ResponseBase, next:NextFunction) => {
    if (req.session && (req.session.user || req.session.jwt)) {
        next()
    } else if (req.url === '/api/user/anonymous/channels' || req.url === '/api/user/signin' || req.url === '/api/user/signup') {
        next()
    } else {
        const status: ResBodyBase = {
            success: false,
            code: UNAUTHORIZED,
            msg: '您还未登录'
        }
        res.status(UNAUTHORIZED).json(status)
        wallLog.warn(`拦截url：${req.originalUrl}`)
    }
}
