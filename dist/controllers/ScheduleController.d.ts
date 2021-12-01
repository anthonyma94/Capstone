import { Request } from "express";
import { BaseHttpController } from "inversify-express-utils";
import ScheduleService from "../services/ScheduleService";
export default class ScheduleController extends BaseHttpController {
    private service;
    constructor(service: ScheduleService);
    getRules(): Promise<import("inversify-express-utils/dts/results").JsonResult>;
    getScheduleStartDates(): Promise<import("inversify-express-utils/dts/results").JsonResult>;
    getSchedule(req: Request): Promise<import("inversify-express-utils/dts/results").JsonResult>;
    editScheduleItem(req: Request): Promise<import("inversify-express-utils/dts/results").StatusCodeResult>;
    addScheduleItem(req: Request): Promise<import("inversify-express-utils/dts/results").JsonResult>;
    deleteScheduleItem(req: Request): Promise<import("inversify-express-utils/dts/results").StatusCodeResult>;
    setDefaultSchedule(req: Request): Promise<void>;
    addScheduleRule(req: Request): Promise<import("inversify-express-utils/dts/results").JsonResult>;
    deleteScheduleRule(req: Request): Promise<import("inversify-express-utils/dts/results").StatusCodeResult>;
}
