import { NextFunction, Request, Response } from "express";
import { JobTitle } from "../entities/JobTitle";
import JobTitleService from "../services/JobTitleService";
import { BaseController } from "./BaseController";
export default class JobTitleController extends BaseController<JobTitleService, JobTitle> {
    constructor(service: any);
    add(req: Request, res: Response, next: NextFunction): Promise<import("inversify-express-utils/dts/results").JsonResult>;
}
