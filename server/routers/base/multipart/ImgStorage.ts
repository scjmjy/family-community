import os from 'os'
import fs from 'fs'
import path from 'path'
import { getExtension } from 'mime'
import { StorageEngine } from "multer";
import sharp from 'sharp'

import { RequestBase } from '../request'

export interface ImgStorageOptions {
    fulldir: string | ((req: RequestBase, file: Express.Multer.File) => string) // 原始图片文件要保存到的目录，同时图片对应的thumbnail会在同一层目录里
    basename: string | ((req: RequestBase, file: Express.Multer.File) => string) // 原始图片要保持的名字(不包括扩展名)，对应的thumbnail的名字是basename.thumb.[ext]
    urldir: string | ((req: RequestBase, file: Express.Multer.File) => string) // 用于嵌入到html页面中，<img src="urldir/filename">
    width: number // 缩略图的宽度
    height: number // 缩略图的高度
    allways: boolean // 如果原始图片比指定的缩略图的尺寸还要小，allways为true时，依然会生成缩略图，否则不生产缩略图，而是直接将缩略图的path指向原始图片保存的位置
}

declare global {
    namespace Express {
        namespace Multer {
            interface File {
                thumbPath: string
                thumbSize: number
            }
        }
    }
}

export default class ImgStorage implements StorageEngine {
    constructor(private opts: ImgStorageOptions) {}

    _handleFile(req: RequestBase, file: Express.Multer.File, cb: (error?: any, info?: Partial<Express.Multer.File>) => void) {
        let fpath = ''
        if (typeof this.opts.fulldir === "string") {
            fpath = this.opts.fulldir
        } else if (typeof this.opts.fulldir === "function") {
            fpath = this.opts.fulldir(req, file)
        } else {
            throw new Error("错误的配置：fulldir 只能是 string 或 function")
        }

        let fname = ''
        let fthumbname = ''
        if (typeof this.opts.basename === "string") {
            fname = this.opts.basename + '.' + getExtension(file.mimetype)
            fthumbname = this.opts.basename + '.thumb.' + getExtension(file.mimetype)
        } else if (typeof this.opts.basename === "function") {
            fname = this.opts.basename(req, file) + '.' + getExtension(file.mimetype)
            fthumbname = this.opts.basename(req, file) + '.thumb.' + getExtension(file.mimetype)
        } else {
            throw new Error("错误的配置：basename 只能是 string 或 function")
        }

        let urldir = ''
        if (typeof this.opts.urldir === "string") {
            urldir = this.opts.urldir
        } else if (typeof this.opts.urldir === "function") {
            urldir = this.opts.urldir(req, file)
        } else {
            throw new Error("错误的配置：basename 只能是 string 或 function")
        }

        fs.mkdir(fpath,{ recursive: true }, err => {
            if (err) {
                cb(err)
                return
            }
            const orignImgPath = path.join(fpath, fname )
            const thumbImgPath = path.join(fpath, fthumbname)
            const orginUrl = path.join(urldir, fname)
            const thumbnUrl = path.join(urldir, fthumbname)

            const imgTrans = sharp().resize(this.opts.width, this.opts.height)
            const orignImgDest = fs.createWriteStream(orignImgPath)
            const thumbImgDest = fs.createWriteStream(thumbImgPath)
            file.stream.pipe(imgTrans).pipe(thumbImgDest).on('error', err => cb(err))
            file.stream.pipe(orignImgDest).on('error', err => cb(err))
            let count = 0
            function onBothFinished () {
                if (count++ === 1) {
                    cb(null, {
                        path: orginUrl,
                        thumbPath: thumbnUrl,
                        size: orignImgDest.bytesWritten,
                        thumbSize: thumbImgDest.bytesWritten,
                    })
                }
            }
            orignImgDest.on('finish', onBothFinished)
            thumbImgDest.on('finish', onBothFinished)
        })
    }
    _removeFile(req: RequestBase, file: Express.Multer.File, cb: (error?: any, info?: Partial<Express.Multer.File>) => void) {
        fs.unlink(file.path, cb)
    }
}
