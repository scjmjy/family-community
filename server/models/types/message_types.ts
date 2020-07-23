import { Document } from 'mongoose'
import { Message, MySocket } from '../../chats/ChatManager'

type Content = {
    imgs: string[];
    txt: string
}

export class MsgP2PToCreate {
    constructor(public sender: string, public to: string, public content: Content, public readed: boolean) {}

    static from(message: Message, socket: MySocket) {
        return new MsgP2PToCreate(socket.uid, message.to, { imgs: [], txt: message.content.txt }, false)
    }
}

export class MsgP2PToClient extends MsgP2PToCreate {
    constructor(public createdAt: string, sender: string, to: string, content: Content, readed: boolean) {
        super(sender, to, content, readed)
    }
}

export type IMsgP2PDoc = MsgP2PToClient & Document

export class MsgFamilyToCreate {
    constructor(public sender: string, public family: string, public content: Content, public readed: string[]) {}

    static from(message: Message, socket: MySocket) {
        return new MsgFamilyToCreate(socket.uid, socket.fid, { imgs: [], txt: message.content.txt }, [])
    }
}

export class MsgFamilyToClient extends MsgFamilyToCreate {
    constructor(public createdAt: string, sender: string, family: string, content: Content, readed: string[]) {
        super(sender, family, content, readed)
    }
}

export type IMsgFamilyDoc = MsgFamilyToClient & Document
