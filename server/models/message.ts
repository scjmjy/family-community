import m from 'mongoose'
import { IMsgP2PDoc, IMsgFamilyDoc } from './types/message_types'

const MsgP2PSchema = new m.Schema(
    {
        sender: {
            type: m.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        to: {
            type: m.Schema.Types.ObjectId,
            required: true,
        },
        content: {
            imgs: [{
                type:  m.Schema.Types.ObjectId,
                ref: 'Image'
            }],
            txt: {
                type: String
            }
        },
        readed: {
            type: Boolean,
            required: true
        }
    },
    {
        timestamps: true,
    }
)

export const MsgP2PModel = m.model<IMsgP2PDoc>('MsgP2P', MsgP2PSchema)


const MsgFamilySchema = new m.Schema(
    {
        sender: {
            type: m.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        family: {
            type: m.Schema.Types.ObjectId,
            ref: 'Family',
            required: true
        },
        content: {
            imgs: [{
                type:  m.Schema.Types.ObjectId,
                ref: 'Image'
            }],
            txt: {
                type: String
            }
        },
        readed: [{
            type: m.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }]
    },
    {
        timestamps: true,
    }
)

export const MsgFamilyModel = m.model<IMsgFamilyDoc>('MsgFamily', MsgFamilySchema)
