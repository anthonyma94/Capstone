/**
 * Similar to BaseService, this controller is extended by other controllers to perform basic functions.
 * Also similar to BaseService, this design pattern originated from ASP.NET, where all logic
 * is performed within the controller. I switched to a more common NodeJS pattern throughout
 * the project where controllers call specific service methods and return its result.
 */

import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { BaseHttpController } from "inversify-express-utils";
import BaseEntity from "../entities/BaseEntity";
import { BaseService } from "../services/BaseService";
import { Delete, Get } from "../utils/decorators";

@injectable()
export abstract class BaseController<
    T extends BaseService<U>,
    U extends BaseEntity
> extends BaseHttpController {
    protected readonly service: T;
    constructor(_service: T) {
        super();
        this.service = _service;
    }
    @Get("/:id")
    public async find(req: Request, res: Response, next: NextFunction) {
        const result = await this.service.getOne(req.params.id);
        return this.json(result);
    }
    @Delete("/:id")
    public async delete(req: Request, res: Response, next: NextFunction) {
        const item = await this.service.getOne(req.params.id);
        if (!item) throw new Error("Item with ID not found.");
        await this.service.delete(item);
        return this.json(item, 200);
    }
    @Get("/")
    public async get(req: Request, res: Response, next: NextFunction) {
        const result = await this.service.getAll();

        return this.json(result);
    }
}
