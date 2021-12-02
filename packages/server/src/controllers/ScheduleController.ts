/**
 * This uses NodeJS design pattern (refer to BaseController).
 */
import dayjs from "dayjs";
import { Request } from "express";
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
    @Get("/rules", AuthMiddleware)
    public async getRules() {
        const resp = await this.service.getRules();

        return this.json(resp, 200);
    }
    @Get("/startdates")
    public async getScheduleStartDates() {
        const res = await this.service.getScheduleStartDates();

        return this.json(res, 200);
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

        data.start = dayjs(data.start);
        data.end = dayjs(data.end);
        if (data.date) {
            data.date = dayjs(data.date);
        }

        const res = await this.service.addOrEditScheduleRule(data);

        return this.json(res);
    }

    @Delete("/rules/:id", AuthMiddleware)
    public async deleteScheduleRule(req: Request) {
        const id = req.params.id;

        await this.service.deleteScheduleRule(id);
        return this.statusCode(200);
    }
}
