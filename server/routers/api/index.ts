import { Router } from 'express'

import userRouter from './user'
import familyRouter from './family'
import imageRouter from './image'
import galleryRouter from './gallery'

const apiRouter = Router()

apiRouter.use('/user', userRouter)
apiRouter.use('/family', familyRouter)
apiRouter.use('/image', imageRouter)
apiRouter.use('/gallery', galleryRouter)

export default apiRouter
