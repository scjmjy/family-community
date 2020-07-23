import { Response, NextFunction } from 'express'
import token from 'rand-token'
import path from 'path'


import { RequestBase } from './request'
import AppLog from '../../base/AppLog'
import { UserSession } from 'models/user'

// 用于存储在服务器端的session，每个用户会话一个session
export type SessionType = {
    sid: string,
    user?: UserSession,
    jwt?: string,
    lastAccessed?: number
}

// export class ServerSession {
//     public sid: string
//     public user?: UserSession

//     public constructor (){
//         this.sid = token.generate(16)
//     }

//     onUserSignedIn
// }

// export class SessionStore {
//     protected store = new Map<string, ServerSession>()
//     static NewSession () {
//         return new ServerSession()
//     }
// }

// 用于存储在客户端的cookies
export class ClientCookies {
    constructor () {
    }
}

const sessionStore = new Map<string, SessionType>()

const SID_KEY = 'sid'
const SID_MAXAGE = 1000 * 60 * 60 * 24 // 24h

const slog = new AppLog('server:session')

export default (req: RequestBase, res: Response, next: NextFunction) => {
    let sid = req.cookies[SID_KEY]
    let session: SessionType | undefined
    if (sid) {
        session = sessionStore.get(sid)
    }
    if (session) {
        // TODO 检验是否过期
    } else {
        if (sid) {
            slog.info(`过期的sid: ${sid}`)
        }
        if (req.url === '/api/user/signin') {
            sid = token.generate(16)
            res.cookie(SID_KEY, sid, { maxAge: SID_MAXAGE })
            session = {
                sid,
                lastAccessed: Date.now()
            }
            sessionStore.set(sid, session)
            slog.info(`生成了新的sid: ${sid}`)
        }
    }
    req.session = session
    next()
}
