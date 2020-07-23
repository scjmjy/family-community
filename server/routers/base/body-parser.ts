import { Request, Response, NextFunction } from 'express'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { getExtension } from 'mime'

import HttpCodes from 'http-status-codes'

import { ResBodyBase } from './response'
import AppLog from '../../base/AppLog'

const bLog = new AppLog('server:body-parser')

export function json (req: Request, res: Response, next: NextFunction) {
    if (req.method !== 'POST') {
        next()
        return
    }
    if (!req.is('json')) {
        next()
        return
    }

    bLog.info('json---开始')
    req.body = {}
    let bodyData = Buffer.from('', 'utf-8')

    req.on('data', chunk => {
        bodyData += chunk
    })

    req.on('end', () => {
        if (bodyData.length > 0) {
            const obj = JSON.parse(bodyData.toString('utf-8'))
            req.body = obj
            bLog.info(JSON.stringify(obj, null, 4))
        }
        bLog.info('json---结束')
        next()
    })
}

// export default (req: Request, res: Response, next: NextFunction) => {
//  else if (req.is('multipart/form-data')) {
//         bLog.info('form-data---开始')
//         const busboy = new BusBoy({ headers: req.headers })

//         busboy.on('field', (fieldname, val) => {
//             bLog.info('form-data---field')
//             req.body[fieldname]= val
//         })

//         busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
//             bLog.info(`form-data---file[${fieldname}, ${filename}, ${encoding}, ${mimetype}]`)
//             var saveTo = path.join(os.tmpdir(), fieldname + '-' + path.basename(filename) + '.' + getExtension(mimetype) || 'noext')
//             file.pipe(fs.createWriteStream(saveTo))
//                 .on('finish', () => {
//                     const f = req.body[fieldname]
//                     if (f) {
//                         if (Array.isArray(f)) {
//                             f.push(saveTo)
//                         } else {
//                             const fileArray = [req.body[fieldname]]
//                             fileArray.push(saveTo)
//                             req.body[fieldname] = fileArray
//                         }
//                     } else {
//                         req.body[fieldname] = saveTo
//                     }
//                 })
//         })

//         busboy.on('finish', () => {
//             bLog.info('form-data---结束')
//             next()
//         })
//         req.pipe(busboy)
//     } else {
//         const status: ResBodyBase = {
//             code: HttpCodes.BAD_REQUEST,
//             success: false,
//             msg: `不支持的数据格式`
//         }
//         res.status(status.code).json(status)
//     }
// }
