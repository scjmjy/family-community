import m from 'mongoose'
import AppLog from '../base/AppLog'

function init() {
    const mLog = new AppLog('server:mongoose')

    m.set('useFindAndModify', false)
    m.set('useUnifiedTopology', true)
    m.set('useCreateIndex', true)
    m.Promise = global.Promise

    const URI_MONGOOSE = process.env.URI_MONGOOSE || 'mongodb://localhost:27017/family-community'
    // const URI_MONGODB = process.env.URI_MONGODB || 'mongodb+srv://ronnie:33o93o6@mjy-personal-db-cluster.jh7i5.mongodb.net/family-community?retryWrites=true%26w=majority'

    m.connect(URI_MONGOOSE, { useNewUrlParser: true })

    const mcon = m.connection

    mcon.once('open', () => {
        mLog.info(`连接成功 >> ${URI_MONGOOSE}`)
    })

    mcon.once('error', () => {
        mLog.error(`连接失败 >> ${URI_MONGOOSE}`)
    })
}

export default {
    init
}
