import { ResBodyBase, ResponseBase } from '../../base/response'
import { RequestBase } from '../../../routers/base/request'

type P2PParams = {
    p1: string;
    p2: string;
}

type P2PQuery = {
    limit: number; // 当begin没有指定时，limit表示要获取的消息的条数
    begin: number; // 获取从begin表示的时间以来的所有消息
}

export type P2PChatsRequest = RequestBase<P2PParams, ResBodyBase, never, P2PQuery>
export type P2PChatsResponse = ResponseBase
