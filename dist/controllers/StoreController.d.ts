import { NextFunction, Request, Response } from "express";
import Store from "../entities/Store";
import { StoreService } from "../services/StoreService";
import { BaseController } from "./BaseController";
export default class StoreController extends BaseController<StoreService, Store> {
    constructor(service: StoreService);
    add(req: Request, res: Response, next: NextFunction): Promise<import("inversify-express-utils/dts/results").JsonResult>;
    changeName(req: Request, res: Response, next: NextFunction): Promise<import("inversify-express-utils/dts/results").JsonResult>;
    changeHours(req: Request): Promise<import("inversify-express-utils/dts/results").JsonResult>;
}
