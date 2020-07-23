import { Request, Response, NextFunction } from 'express'

type CookiesType = {
    [key: string]: any
}

function parseCookies(cookiestr: string) {
    const cookies: CookiesType = {}
    const cookieArray = cookiestr.split(';')
    cookieArray.forEach(cookie => {
        const kv = cookie.split('=')
            if (kv.length==2) {
                cookies[kv[0].trim()] = kv[1].trim()
            }
        })
    return cookies
}

export default (req: Request, res: Response, next: NextFunction) => {
    req.cookies = parseCookies(req.headers.cookie || '')
    next()
}
