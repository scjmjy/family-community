import { Server } from 'http'
import socketio, { Socket } from 'socket.io'

import AppLog from '../base/AppLog'

import cp from '../routers/base/cookie-parser'
import sp from '../routers/base/session-parser'
import { MsgP2PToCreate, IMsgP2PDoc, MsgFamilyToCreate, IMsgFamilyDoc } from '../models/types/message_types'
import { MsgP2PModel, MsgFamilyModel } from '../models/message'

const ioLog = new AppLog('server:io')

export type MySocket = Socket & {
    fchats: FamilyChats
    uid: string
    fid: string
}

export type Content = {
    imgs?: Buffer[]
    txt: string
}
export type Message = {
    to: string // to uid
    content: Content
}

export enum AckCodes {
    OK, ERROR
}

const wrap = (middleware: any) => (socket: Socket, next: Function) => {
    middleware(socket.request, {}, next)
}

export default class ChatManager {
    private io: socketio.Server
    private families = new Map<string, FamilyChats>() // fid -> FamilyChats
    constructor(server: Server) {
        this.io = socketio(server, { perMessageDeflate: false })
        this.io.on('error', (err: Error) => {
            ioLog.error('IO Error: ' + err.message)
        })
        this.io.use(wrap(cp))
        this.io.use(wrap(sp))
        this.io.use((s, next) => {
            if (!s.request.session || !s.request.session.user) {
                return next(new Error('还没有登录'))
            }
            next()
        })
        this.io.on('connection', (socket: MySocket) => {
            ioLog.info(`新的连接：${socket.id}`)

            const uid = socket.request.session.user._id
            const fid = socket.request.session.user.fid
            socket.uid = uid
            socket.fid = fid
            if (fid) {
                let fchats = this.families.get(fid)
                if (!fchats) {
                    fchats = new FamilyChats(this.io, fid)
                    this.families.set(fid, fchats)
                }
                fchats.join(uid, socket)
                socket.fchats = fchats
            }

            socket.on('disconnect', () => {
                if (socket.fchats) {
                    socket.fchats.leave(socket.uid, socket)
                }
                ioLog.info(`客户端断开连接：${socket.id}，${socket.uid}, ${socket.fid}`)
            })

            socket.on('private-message', (message: Message, ackFn) => {
                // uid: 目标user
                ioLog.info(`private-message：${socket.id}，${JSON.stringify(message, null, 4)}`)
                if (!message.to || !message.content || !(message.content.txt || message.content.imgs)) {
                    ioLog.error('客户端发送的消息格式不正确')
                    return
                }
                if (message.content.imgs) {
                    // await
                }
                const msgToCreate = MsgP2PToCreate.from(message, socket)
                MsgP2PModel.create<MsgP2PToCreate>(msgToCreate)
                    .then((mdoc) => {
                        ackFn({ code: AckCodes.OK, data: mdoc })
                        socket.fchats.sendTo(socket, mdoc)
                    })
                    .catch((err) => {
                        ackFn({ code: AckCodes.ERROR, msg: err.message })
                    })
            })

            socket.on('family-message', (message: Message, ackFn) => {
                ioLog.info(`family-message：${socket.id}，${JSON.stringify(message, null, 4)}`)
                if (!socket.fid) {
                    return
                }
                if (!message.content || !(message.content.txt || message.content.imgs)) {
                    ioLog.error('客户端发送的消息格式不正确')
                    return
                }
                if (message.content.imgs) {
                    // await
                }
                const msgToCreate = MsgFamilyToCreate.from(message, socket)
                MsgFamilyModel.create<MsgFamilyToCreate>(msgToCreate)
                    .then((mdoc) => {
                        ackFn({ code: AckCodes.OK, data: mdoc })
                        socket.fchats.sendToFamily(socket, mdoc)
                    })
                    .catch((err) => {
                        ackFn({ code: AckCodes.ERROR, msg: err.message })
                    })
            })

            socket.on('pull-message', (data, ackFn) => {
                const begin = data.begin
                const limit = data.limit
                const end = data.end
                ioLog.info(`pull-message 开始：begin-${begin}，end-${end}，limit-${limit}`)
                const p1 = socket.uid
                const p2 = data.uid
                // 支持的策略：begin / limit / end + limit
                if (!p2) {
                    ioLog.error('客户端发送的消息格式不正确')
                    return
                }
                let query
                let conditions = {
                    $or: [
                        {
                            sender: p1,
                            to: p2,
                        },
                        {
                            sender: p2,
                            to: p1,
                        },
                    ],
                }
                if (begin) {
                    query = MsgP2PModel.find(conditions).gt('createdAt', begin)
                } else if (limit && !end) {
                    query = MsgP2PModel.find(conditions).sort('-createdAt').limit(limit)
                } else if (limit && end) {
                    query = MsgP2PModel.find(conditions).sort('-createdAt').lt('createdAt', end).limit(limit)
                } else {
                    throw new Error('不支持的消息获取策略')
                }

                query.exec()
                    .then(docs => {
                        ackFn({ code: AckCodes.OK, data: docs })
                        ioLog.info(`pull-message 结束 成功：${docs.length}条消息`)
                    }).catch(err => {
                        ackFn({ code: AckCodes.ERROR, msg: err.message })
                        ioLog.error(`pull-message 结束 失败：${err.message}`)
                    })
            })
            socket.on('pull-message-family', (data, ackFn) => {
                const begin = data.begin
                const limit = data.limit
                const end = data.end
                ioLog.info(`pull-message-family 开始：begin-${begin}，end-${end}，limit-${limit}`)
                // 支持的策略：begin / limit / end + limit
                let query
                if (begin) {
                    query = MsgFamilyModel.find({ family: socket.fid }).gt('createdAt', begin)
                } else if (limit && !end) {
                    query = MsgFamilyModel.find({ family: socket.fid }).sort('-createdAt').limit(limit)
                } else if (limit && end) {
                    query = MsgFamilyModel.find({ family: socket.fid }).sort('-createdAt').lt('createdAt', end).limit(limit)
                } else {
                    throw new Error('不支持的消息获取策略')
                }

                query.exec()
                    .then(docs => {
                        ackFn({ code: AckCodes.OK, data: docs })
                        ioLog.info(`pull-message-family 结束 成功：${docs.length}条消息`)
                    }).catch(err => {
                        ackFn({ code: AckCodes.ERROR, msg: err.message })
                        ioLog.error(`pull-message-family 结束 失败：${err.message}`)
                    })
            })
        })

    }
}

class FamilyChats {
    private members = new Map<string, Socket>() // uid -> Socket
    constructor(private io: socketio.Server, private fid: string) {}
    join(uid: string, member: MySocket) {
        this.members.set(uid, member)
        member.join(this.fid)
    }
    leave(uid: string, member: MySocket) {
        member.leave(this.fid)
        this.members.delete(uid)
    }
    sendTo(sender: MySocket, mdoc: IMsgP2PDoc) {
        const toSocket = this.members.get(mdoc.to.toString())
        if (toSocket) {
            sender.to(toSocket.id).emit('private-message', mdoc)
            // toSocket.emit('private-message', mdoc)
        }
    }
    sendToFamily(sender: MySocket, mdoc: IMsgFamilyDoc) {
        sender.to(this.fid).emit('family-message', mdoc)
    }
}
