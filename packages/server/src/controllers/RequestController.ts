/**
 * This uses NodeJS design pattern (refer to BaseController).
 * Can be expanded to include other requests, currently only handles TimeOff.
 */
import dayjs from "dayjs";
import { Request } from "express";
import { inject } from "inversify";
import { BaseHttpController } from "inversify-express-utils";
import AuthMiddleware from "../middleware/AuthMiddleware";
import RequestService from "../services/RequestService";
import { Controller, Get, Post, Put } from "../utils/decorators";

@Controller()
export default class RequestController extends BaseHttpController {
    constructor(@inject(RequestService) private service: RequestService) {
        super();
    }

    @Get("/timeoff")
    public async getTimeOff(req: Request) {
        if (req.currentUser.role === "admin") {
            const res = await this.service.getTimeOffRequest();
            return this.json(res);
        } else {
            if (!req.currentUser.user) throw new Error("Missing user.");
            const res = await this.service.getTimeOffRequest(
                req.currentUser.user
            );
            return this.json(res);
        }
    }

    @Post("/timeoff")
    public async submitTimeOff(req: Request) {
        const user = req.currentUser;
        if (!user.user) throw new Error("Missing user.");

        const params = req.body;
        params.start = dayjs(params.start);
        params.end = dayjs(params.end);

        const res = await this.service.createTimeOffRequest({
            person: user.user,
            ...params
        });

        return this.json(res);
    }

    @Put("/timeoff/approve", AuthMiddleware)
    public async approveTimeOff(req: Request) {
        const params = {
            id: req.body.id,
            decision: req.body.action === "approve"
        };

        const res = await this.service.approveOrDenyTimeOffRequest(
            params.id,
            params.decision
        );

        return this.json(res);
    }
}
