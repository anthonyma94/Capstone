import dayjs from "dayjs";
import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { BaseHttpController } from "inversify-express-utils";
import AuthMiddleware from "../middleware/AuthMiddleware";
import ScheduleService from "../services/ScheduleService";
import { Controller, Delete, Get, Post, Put } from "../utils/decorators";

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
    @Get("/")
    @Post("/", AuthMiddleware)
    public async getSchedule(req: Request) {
        const q = req.query;
        const start = dayjs(q.start as any);
        if (!start.isValid()) {
            throw new Error("Invalid start date.");
        }

        if (req.method.toUpperCase() === "POST") {
            await this.service.createSchedule(start);
        }

        const user = req.currentUser;

        const resp = await this.service.getSchedule(
            start,
            user.user || "admin"
        );
        return this.json(resp, 200);
    }

    @Put("/item", AuthMiddleware)
    public async editScheduleItem(req: Request) {
        // body:
        // {
        //     id: schedule item id,
        //     date: schedule item Date,
        //     start: schedule item start,
        //     end: schedule item end,
        //     personId: schedule item person Id if exists
        // }
        const date = new Date(req.body.date);

        await this.service.editScheduleItem({
            ...req.body,
            date
        });

        return this.statusCode(200);
    }

    @Post("/item", AuthMiddleware)
    public async addScheduleItem(req: Request) {
        const payload = {
            ...req.body,
            date: dayjs(req.body.date)
        };

        const res = await this.service.addScheduleItem(payload);

        return this.json(res);
    }

    @Delete("/item", AuthMiddleware)
    public async deleteScheduleItem(req: Request) {
        await this.service.deleteScheduleItem(req.query.id as string);
        return this.statusCode(204);
    }

    @Post("/default", AuthMiddleware)
    public async setDefaultSchedule(req: Request) {
        const date = req.body.date;
        if (!date || !dayjs(date).isValid()) {
            throw new Error("Invalid date.");
        }

        await this.service.setDefaultSchedule(dayjs(date));
    }

    @Post("/rules", AuthMiddleware)
    public async addScheduleRule(req: Request) {
        const data = req.body;

        if (data.type === "recurring") {
            data.start = dayjs(data.start);
            data.end = dayjs(data.end);
        }

        const res = await this.service.addScheduleRule(data);

        return this.json(res);
    }
}
