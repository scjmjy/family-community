import express, { Router } from 'express'

import cp from './base/cookie-parser'
// import qp from './base/query-parser'
import sp from './base/session-parser'
import { json } from './base/body-parser'
import authWall from './base/authWall'
import { error404, error500 } from './error_handler'

import apiRouter from './api'
import { RequestBase } from './base/request'

const router = Router()
// router.use('/', qp)
router.use(cp)
router.use(sp) // session-parser 依赖 cookie-parser，所以放在cp后面
router.use('/', authWall)
router.use('/', json)
// router.use('/', ap) // auth-parser 依赖 body-parser，所以放在bp后面
router.use('/api', apiRouter)
router.use('/', error404)
router.use('/', error500)
// server.use('*', (req, res, next) => {
//     res.sendFile(__dirname + '/public/index.html')
// })

export default router
