import express from "express"
import path from "path"

import router from './routers/index'
import M from './models'
import AppLog from './base/AppLog'
import ChatManager from "./chats/ChatManager"

const sLog = new AppLog('server')
const PORT = process.env.PORT || 3000

export const server = express()
server.set('ENV-PORT', PORT)
server.set('ENV-IS-PROD', process.env.NODE_ENV == 'production')
server.set('ENV-STATIC-DIR', path.join(__dirname, 'public'))
server.set('ENV-FAMILY-AVATAR-DIR', 'img/avatar/family')
server.set('ENV-USER-AVATAR-DIR', 'img/avatar/user')
server.set("ENV-IMGUPLOAD-DIR", 'img/galleries')

server.use(express.static(__dirname + '/public'))
server.use(router)

M.init()

const s = server.listen(server.get('ENV-PORT'), () => {
    sLog.info(`Express server is listening on port: ${server.get('ENV-PORT')}`)
})
const chats = new ChatManager(s)
