import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { JobTitle } from "../entities/JobTitle";
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

    @Post("/")
    public async add(req: Request, res: Response, next: NextFunction) {
        if (!req.body || !req.body.name) {
            throw new Error("Store must have a name.");
        }
        const title = new JobTitle(req.body.name);
        const result = await this.service.add(title);
        return this.json(result, 201);
    }
}
