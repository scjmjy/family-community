import { ResBodyBase, ResponseBase } from '../../base/response'
import { RequestBase } from '../../base/request'

type FamilyCreateReqBody = {
    familyname: string
    description: string
}

export type FamilyCreateRequest = RequestBase<never, ResBodyBase, FamilyCreateReqBody, never>
export type FamilyCreateResponse = ResponseBase

type FamilySearchReqQuery = {
    key: string
}

export type FamilySearchRequest = RequestBase<never, never, never, FamilySearchReqQuery>
export type FamilySearchResponse = ResponseBase

type FamilyJoinReqParams = {
    fid: string
}

export type FamilyJoinRequest = RequestBase<FamilyJoinReqParams, never, never, never>
export type FamilyJoinResponse = ResponseBase

type GalleriesParams = {
    fid: string;
}

type GalleriesQuery = {
    begin: string;
}

export type GalleriesRequest = RequestBase<GalleriesParams, never, never, GalleriesQuery>
export type GalleriesResponse = ResponseBase
