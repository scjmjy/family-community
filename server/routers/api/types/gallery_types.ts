import { ResBodyBase, ResponseBase } from '../../base/response'
import { RequestBase } from '../../base/request'

type ReqBody = {
    title: string
    description: string
}

type Query = {
    belong: 'family' | 'user'
}

export type GalleryCreateRequest = RequestBase<never, ResBodyBase, ReqBody, Query>
export type GalleryCreateResponse = ResponseBase
