import { Request } from "express";
import { BaseHttpController } from "inversify-express-utils";
import RequestService from "../services/RequestService";
export default class RequestController extends BaseHttpController {
    private service;
    constructor(service: RequestService);
    getTimeOff(req: Request): Promise<import("inversify-express-utils/dts/results").JsonResult>;
    submitTimeOff(req: Request): Promise<import("inversify-express-utils/dts/results").JsonResult>;
    approveTimeOff(req: Request): Promise<import("inversify-express-utils/dts/results").JsonResult>;
}
