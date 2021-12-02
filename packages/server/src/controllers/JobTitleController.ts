import { Request } from "express";
import { inject } from "inversify";
import { JobTitle } from "../entities/JobTitle";
import AuthMiddleware from "../middleware/AuthMiddleware";
import JobTitleService from "../services/JobTitleService";
import { Controller, Post } from "../utils/decorators";
import { BaseController } from "./BaseController";

@Controller()
export default class JobTitleController extends BaseController<
    JobTitleService,
    JobTitle
> {
    constructor(
        @inject(JobTitleService)
        service: any
    ) {
        super(service);
    }

    @Post("/", AuthMiddleware)
    public async add(req: Request) {
        if (!req.body || !req.body.name) {
            throw new Error("Store must have a name.");
        }
        // Generate random color
        const n = (Math.random() * 0xfffff * 1000000).toString(16);
        const color = "#" + n.slice(0, 6);
        const title = new JobTitle(req.body.name, color);
        const result = await this.service.add(title);
        return this.json(result, 201);
    }
}
