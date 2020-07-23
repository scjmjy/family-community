import { Response } from 'express'

export type ResBodyBase = {
    code: number, // 用来标志状态的code，客户端根据此code来得知具体的请求结果如何
    success: boolean, // 用来标志客户端此次请求是否得到了想要的结果
    msg?: any, // 如果 success 为 true，msg 一般是空的, 如果 success 为 false，msg 包含了错误信息
    data?: any // 如果 success 为 true，data 包含了返回的数据
}

export interface ResponseBase<ResBody = ResBodyBase> extends Response<ResBody> {

}
