import { NextFunction } from 'express'
import HttpCodes from 'http-status-codes'

import { ResponseBase, ResBodyBase } from './base/response'
import { RequestBase } from './base/request'
import AppLog from '../base/AppLog'

const eLog = new AppLog('server:error_handler')

export const error404 = (req: RequestBase, res: ResponseBase) => {
    eLog.warn(`${req.url} not found, METHOD: ${req.method}`)
    const status: ResBodyBase = {
        success: false,
        code: HttpCodes.NOT_FOUND,
        msg: '您要访问的资源不存在。'
    }
    res.status(status.code).json(status)
}

export const error500 = (err: Error, req: RequestBase, res: ResponseBase, next: NextFunction) => {
    eLog.error(`${err.message}`)

    const status: ResBodyBase = {
        success: false,
        code: HttpCodes.INTERNAL_SERVER_ERROR,
        msg: '不要意思，发生了未知的错误。'
    }
    res.status(status.code).json(status)
}
