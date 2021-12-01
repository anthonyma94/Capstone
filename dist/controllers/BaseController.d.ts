import { NextFunction, Request, Response } from "express";
import { BaseHttpController } from "inversify-express-utils";
import BaseEntity from "../entities/BaseEntity";
import { BaseService } from "../services/BaseService";
export declare abstract class BaseController<T extends BaseService<U>, U extends BaseEntity> extends BaseHttpController {
    protected readonly service: T;
    constructor(_service: T);
    find(req: Request, res: Response, next: NextFunction): Promise<import("inversify-express-utils/dts/results").JsonResult>;
    delete(req: Request, res: Response, next: NextFunction): Promise<import("inversify-express-utils/dts/results").JsonResult>;
    get(req: Request, res: Response, next: NextFunction): Promise<import("inversify-express-utils/dts/results").JsonResult>;
}
