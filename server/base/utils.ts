import fs from 'fs'
import path from 'path'
import stream from 'stream'


export const isEmail = (s: string) => {
    return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(s)
}
export const isMobile = (s: string/* , locale: string */) => {
    return /^1\d{10}$/.test(s)
}

export function copyFile (srcfullpath: string, destfullpath: string) {
    const dir = path.dirname(destfullpath)

    return fs.promises.mkdir(dir, { recursive: true })
        .then(dir => {
            return new Promise<string>((resolve,  reject) => {
                const source = fs.createReadStream(srcfullpath, { encoding: 'binary' })
                const dest = fs.createWriteStream(destfullpath, { encoding: 'binary' })
                source.pipe(dest)
                    .on('error', err => {
                        reject(err)
                    })
                    .on('finish', () => {
                        resolve(srcfullpath)
                    })
            })
        })
}

export function copyFiles (srcPathes: string[], destPathes: string[]) {
    if (srcPathes.length !== destPathes.length || srcPathes.length === 0 || destPathes.length === 0) {
        return Promise.reject(new Error('路径参数不正确'))
    }
    let ps: Promise<string>[] = []
    srcPathes.forEach((src, index) => {
        ps.push(copyFile(src, destPathes[index]))
    })
    return Promise.all(ps)
}

// export function writeFile (fullPath: string, data: any) {
//     const promise = new Promise<boolean>((res, rej) => {
//         const dir = path.dirname(fullPath)

//         fs.mkdir(dir, { recursive: true }, (err) => {
//             if (err) {
//                 rej(err.message)
//             } else {
//                 if (data instanceof stream.Readable) {
//                     (data as stream.Readable).pipe(fs.createWriteStream(fullPath))
//                         .on('end', () => {
//                             res(true)
//                         }).on('error', err => {
//                             rej(err.message)
//                         })
//                 } else {
//                     fs.writeFile(fullPath, data, e => {
//                         e ? rej(e.message) : res(true)
//                     })
//                 }
//             }
//         })
//     })
//     return promise
// }

export function make_YMD_path () {
    const date = new Date()
    return path.join(date.getFullYear().toString(), (date.getMonth() + 1).toString(), date.getDate().toString())
}
