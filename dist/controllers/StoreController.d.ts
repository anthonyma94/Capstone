import { NextFunction, Request, Response } from "express";
import Store from "../entities/Store";
import DayItemService from "../services/DayItemService";
import StoreHourService from "../services/StoreHourService";
import { StoreService } from "../services/StoreService";
import { BaseController } from "./BaseController";
export default class StoreController extends BaseController<StoreService, Store> {
    private readonly dayItemService;
    private readonly storeHourService;
    constructor(service: StoreService, dayItemService: DayItemService, storeHourService: StoreHourService);
    add(req: Request, res: Response, next: NextFunction): Promise<import("inversify-express-utils/dts/results").JsonResult>;
    changeName(req: Request, res: Response, next: NextFunction): Promise<import("inversify-express-utils/dts/results").JsonResult>;
    changeHours(req: Request, res: Response, next: NextFunction): Promise<Store>;
}
