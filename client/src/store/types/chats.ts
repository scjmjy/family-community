import { EventEmitter } from 'events'
import ColorLog from '../../util/ColorLog'
import Vue from 'vue'
import io from 'socket.io-client'

import { UserClient } from './user_types'

const cLog = new ColorLog('client:chats')

export type Content = {
    imgs?: Blob[];
    txt: string;
}

export class MsgP2PToSend {
    constructor(public to: string, public content: Content) {}
}

export class MsgP2PClient extends MsgP2PToSend {
    constructor(public readed: boolean, public createdAt: string, public sender: string, to: string, content: Content) {
        super(to, content)
    }
}

export class MsgFamilyToSend {
    constructor(public content: Content) {
    }
}

export class MsgFamilyClient extends MsgFamilyToSend {
    constructor(public readed: string[], public createdAt: string, public sender: string, content: Content) {
        super(content)
    }
}

export enum AckCodes {
    OK,
    ERROR
}
export enum Notification {
    NewMember
}

type DataType = MsgP2PClient

type P2PMsgCollection = {
    [key: string]: MsgP2PClient[];
}

export class ChatManager extends EventEmitter {
    private client: SocketIOClient.Socket | undefined = undefined
    // private p2pMsgs = new Map<string, MsgP2PClient[]>() // p2 -> msgs
    private p2pMsgs: P2PMsgCollection = {} // p2 -> msgs
    private fMsgs: MsgFamilyClient[] = []
    private pendingP2pMsgs = new Map<string, MsgP2PClient[]>() // p2 -> msgs
    private userClient: UserClient | undefined = undefined
    private vm: Vue | undefined = undefined
    constructor() {
        super()
    }
    init(user: UserClient, vm: Vue) {
        this.userClient = user
        this.vm = vm
        if (user._id === 'anonymous') {
            throw new Error('请先登录')
        }
        this.client = io({ transports: ['polling', 'websocket'] })
        this.client.on('connect', () => {
            //
            cLog.info('socket已连接')
        })
        this.client.on('disconnect', () => {
            //
            cLog.warn('socket已断开')
        })
        this.client.on('family-message', data => {
            cLog.info(`收到家庭消息：${JSON.stringify(data, null, 4)}`)
            const msgs = this.getFamilyChats()
            msgs.push(data)
            this.emit('family-message', data)
        })
        this.client.on('private-message', (data: DataType) => {
            cLog.info(`收到私信：${JSON.stringify(data, null, 4)}`)
            const msgs = this.getPersonalChats(data.sender)
            msgs.push(data)
            this.emit('private-message', data)
        })
        this.client.on('notification', data => {
            switch (data.code) {
            case Notification.NewMember:

                break

            default:
                break
            }
        })
    }
    uninit() {
        if (this.client) {
            this.client.close()
        }
        this.userClient = undefined
        this.vm = undefined
        this.client = undefined
    }
    isInit() {
        return Boolean(this.client)
    }
    sendToFamily(msg: any) {
        if (!this.client || !this.userClient || !this.userClient.family._id) {
            return
        }
        const client = this.client
        cLog.info(`发送家庭：${JSON.stringify(msg, null, 4)}`)
        return new Promise((resolve, reject) => {
            let content
            if (typeof msg === 'string') {
                content = {
                    txt: msg
                }
            } else if (msg.imgs || msg.txt) {
                content = msg
            } else {
                throw new Error('发送的消息格式错误')
            }
            client.emit('family-message', { content }, ack => {
                cLog.info(`家庭消息发送成功：${JSON.stringify(ack, null, 4)}`)
                if (ack.code === AckCodes.OK) {
                    this.addFamilyChats(ack.data)
                }
                resolve(ack.code)
            })
        })
    }

    sendTo(toUid: string, msg: any) {
        if (!this.client || !this.userClient) {
            return
        }
        const client = this.client
        cLog.info(`发送私信：${JSON.stringify(msg, null, 4)}`)
        return new Promise((resolve, reject) => {
            let content
            if (typeof msg === 'string') {
                content = {
                    txt: msg
                }
            } else if (msg.imgs || msg.txt) {
                content = msg
            } else {
                throw new Error('发送的消息格式错误')
            }
            client.emit('private-message', { to: toUid, content }, ack => {
                cLog.info(`私信发送成功：${JSON.stringify(ack, null, 4)}`)
                if (ack.code === AckCodes.OK) {
                    this.addPersonalChats(toUid, ack.data)
                }
                resolve(ack.code)
            })
        })
    }

    getFamilyChats() {
        return this.fMsgs
    }
    addFamilyChats(data: MsgFamilyClient[] | MsgFamilyClient) {
        const chats = this.getFamilyChats()
        if (Array.isArray(data)) {
            if (data.length === 0) {
                return
            }
            if (data.length > 1) {
                if (data[0].createdAt > data[1].createdAt) {
                    // 说明是降序的，我们重新按升序排序以下
                    data.sort((m1, m2) => {
                        if (m1.createdAt > m2.createdAt) {
                            return 1
                        }
                        return -1
                    })
                }
            }
            if (chats.length === 0 || data[0].createdAt > chats[chats.length - 1].createdAt) {
                chats.push(...data)
                if (this.vm) this.vm.$emit('push-message', { type: 'family' })
            } else if (data[data.length - 1].createdAt < chats[0].createdAt) {
                chats.unshift(...data)
                if (this.vm) this.vm.$emit('unshift-message', { type: 'family' })
            } else {
                throw new Error('消息没有正确排序，或者包含重复的消息')
            }
        } else {
            if (chats.length === 0 || data.createdAt > chats[chats.length - 1].createdAt) {
                chats.push(data)
                if (this.vm) this.vm.$emit('push-message', { type: 'family' })
            } else {
                chats.unshift(data)
                if (this.vm) this.vm.$emit('unshift-message', { type: 'family' })
            }
        }
    }
    updateFamilyChats() {
        if (!this.client || !this.userClient || !this.userClient.family._id) {
            return
        }
        const chats = this.getFamilyChats()
        let begin
        let limit
        if (chats.length === 0) {
            limit = 10
        } else {
            begin = chats[chats.length - 1].createdAt
        }
        this.client.emit('pull-message-family', { begin, limit }, ack => {
            if (ack.code === AckCodes.OK) {
                this.addFamilyChats(ack.data)
            }
        })
    }

    // resolve(true/fale) true: no more data
    historyFamilyChats() {
        if (!this.client || !this.userClient || !this.userClient.family._id) {
            return
        }

        const chats = this.getFamilyChats()
        let end
        const limit = 10
        if (chats.length === 0) {
            //
        } else {
            end = chats[0].createdAt
        }
        const client = this.client
        const user = this.userClient
        const p = new Promise((resolve, reject) => {
            client.emit('pull-message-family', { end, limit }, ack => {
                if (ack.code === AckCodes.OK) {
                    this.addFamilyChats(ack.data)
                    if (Array.isArray(ack.data) && ack.data.length === 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                } else {
                    reject(ack.msg)
                }
            })
        })
        return p
    }
    /** `p2`：其他成员 */
    getPersonalChats(p2) {
        let chats = this.p2pMsgs[p2]
        if (!chats) {
            chats = Vue.set(this.p2pMsgs, p2, [])
        }
        return chats
    }
    addPersonalChats(p2, data: MsgP2PClient[] | MsgP2PClient) {
        const chats = this.getPersonalChats(p2)
        // const pullMsg = chats.length === 0 // 如果没有消息，说明此次add之后，需要向服务器索取历史数据
        if (Array.isArray(data)) {
            if (data.length === 0) {
                return
            }
            if (data.length > 1) {
                if (data[0].createdAt > data[1].createdAt) {
                    // 说明是降序的，我们重新按升序排序以下
                    data.sort((m1, m2) => {
                        if (m1.createdAt > m2.createdAt) {
                            return 1
                        }
                        return -1
                    })
                }
            }
            if (chats.length === 0 || data[0].createdAt > chats[chats.length - 1].createdAt) {
                chats.push(...data)
                if (this.vm) this.vm.$emit('push-message', { type: 'p2p', p2: p2 })
            } else if (data[data.length - 1].createdAt < chats[0].createdAt) {
                chats.unshift(...data)
                if (this.vm) this.vm.$emit('unshift-message', { type: 'p2p', p2: p2 })
            } else {
                throw new Error('消息没有正确排序，或者包含重复的消息')
            }
        } else {
            if (chats.length === 0 || data.createdAt > chats[chats.length - 1].createdAt) {
                chats.push(data)
                if (this.vm) this.vm.$emit('push-message', { type: 'p2p', p2: p2 })
            } else {
                chats.unshift(data)
                if (this.vm) this.vm.$emit('unshift-message', { type: 'p2p', p2: p2 })
            }
        }
    }
    updatePersonalChats(p2) {
        if (!this.client || !this.userClient) {
            return
        }
        const chats = this.getPersonalChats(p2)
        let begin
        let limit
        if (chats.length === 0) {
            limit = 10
        } else {
            begin = chats[chats.length - 1].createdAt
        }
        this.client.emit('pull-message', { uid: p2, begin, limit }, ack => {
            if (ack.code === AckCodes.OK) {
                this.addPersonalChats(p2, ack.data)
            }
        })
    }

    // resolve(true/fale) true: no more data
    historyPersonalChats(p2) {
        if (!this.client || !this.userClient) {
            return
        }

        const chats = this.getPersonalChats(p2)
        let end
        const limit = 10
        if (chats.length === 0) {
            //
        } else {
            end = chats[0].createdAt
        }
        const client = this.client
        const p = new Promise((resolve, reject) => {
            client.emit('pull-message', { uid: p2, end, limit }, ack => {
                if (ack.code === AckCodes.OK) {
                    this.addPersonalChats(p2, ack.data)
                    if (Array.isArray(ack.data) && ack.data.length === 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                } else {
                    reject(ack.msg)
                }
            })
        })
        return p
    }
}
