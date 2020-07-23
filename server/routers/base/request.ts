import { Params, ParamsDictionary } from "express-serve-static-core";
import { Request } from 'express'
import { SessionType } from './session-parser'
import { ResBodyBase } from "./response";

export interface RequestBase<P extends Params = ParamsDictionary, ResBody = ResBodyBase, ReqBody = {}, ReqQuery = {}>
    extends Request<P, ResBody, ReqBody, ReqQuery> {
    session?: SessionType
}
