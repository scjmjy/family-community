import { Router, NextFunction } from 'express'
import { P2PChatsRequest, P2PChatsResponse } from './types/chat_types'
import { MsgP2PModel } from 'models/message'

// const chatRoutes = {
//     p2pChats(req: P2PChatsRequest, res: P2PChatsResponse, next: NextFunction) {
//         if (!req.session || !req.session.user) {
//             next(new Error('没有登录的用户'))
//             return
//         }

//     },
// }

// export const chatRouter = Router()
// chatRouter.get('/p2p/:p1/:p2', chatRoutes.p2pChats)
// // chatRouter.get('/family/:fid', chatRoutes.familyChats)
