/**
 * This uses ASP.NET design pattern (refer to BaseController).
 */

import dayjs from "dayjs";
import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import Store from "../entities/Store";
import AuthMiddleware from "../middleware/AuthMiddleware";
import { StoreService } from "../services/StoreService";
import { Controller, Post, Put } from "../utils/decorators";
import { BaseController } from "./BaseController";

@Controller()
export default class StoreController extends BaseController<
    StoreService,
    Store
> {
    constructor(
        @inject(StoreService)
        service: StoreService
    ) {
        super(service);
    }

    @Post("/", AuthMiddleware)
    public async add(req: Request, res: Response, next: NextFunction) {
        if (!req.body || !req.body.name) {
            throw new Error("Store must have a name.");
        }
        const store = new Store(req.body.name);
        const result = await this.service.add(store);
        return this.json(result, 201);
    }

    @Put("/changename/:id", AuthMiddleware)
    public async changeName(req: Request, res: Response, next: NextFunction) {
        if (!req.params.id) {
            throw new Error("Please provide ID.");
        }
        if (!req.body.name) {
            throw new Error("Please provide name.");
        }
        const store = await this.service.getOne(req.params.id);
        if (!store) {
            throw new Error("No store found with given ID.");
        }
        store.name = req.body.name;
        const result = await this.service.update(store);
        return this.json(result);
    }

    @Put("/changehours/:id", AuthMiddleware)
    public async changeHours(req: Request) {
        const data = req.body.map(
            (item: { id?: string; start: string; end: string }) => {
                return {
                    id: item.id,
                    start: dayjs(item.start),
                    end: dayjs(item.end)
                };
            }
        );

        if (
            data.some(
                (item: any) => !item.start.isValid() || !item.end.isValid()
            )
        )
            throw new Error("Invalid dates.");

        const res = await this.service.changeHours(req.params.id, data);

        return this.json(res);
    }
}
