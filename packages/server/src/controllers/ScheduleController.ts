import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController } from "inversify-express-utils";
import Schedule from "../entities/Schedule";
import ScheduleService from "../services/ScheduleService";
import { Controller, Get } from "../utils/decorators";

@Controller()
export default class ScheduleController extends BaseHttpController {
    constructor(@inject(ScheduleService) private service: ScheduleService) {
        super();
    }
    @Get("/rules")
    public async getRules(req: Request, res: Response, next: NextFunction) {
        const resp = await this.service.getRules();

        return this.json(resp, 200);
    }
}
