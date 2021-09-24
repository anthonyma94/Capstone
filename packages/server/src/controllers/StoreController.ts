import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import DayItem, { DayNames } from "../entities/DayItem";
import Store from "../entities/Store";
import StoreHour from "../entities/StoreHour";
import DayItemService from "../services/DayItemService";
import StoreHourService from "../services/StoreHourService";
import { StoreService } from "../services/StoreService";
import { Controller, Get, Post, Put } from "../utils/decorators";
import { BaseController } from "./BaseController";

@Controller()
export default class StoreController extends BaseController<
    StoreService,
    Store
> {
    constructor(
        @inject(StoreService)
        service: StoreService,

        @inject(DayItemService)
        private readonly dayItemService: DayItemService,

        @inject(StoreHourService)
        private readonly storeHourService: StoreHourService
    ) {
        super(service);
    }

    @Post("/")
    public async add(req: Request, res: Response, next: NextFunction) {
        if (!req.body || !req.body.name) {
            throw new Error("Store must have a name.");
        }
        const store = new Store(req.body.name);
        const result = await this.service.add(store);
        return this.json(result, 201);
    }

    @Put("/changename/:id")
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

    @Put("/changehours/:id")
    public async changeHours(req: Request, res: Response, next: NextFunction) {
        if (!req.params.id) throw new Error("Please provide ID.");
        const store = await this.service.getOne(req.params.id);
        if (!store) throw new Error("No store found with given ID.");

        const body = req.body as Array<{
            id?: string;
            start?: string;
            end?: string;
        }>;
        if (!body) throw new Error("No body found.");

        for (let i = 0; i < body.length; i++) {
            const item = body[i];

            // New item
            if (!item.id) {
                if (item.start && item.end) {
                    const newDay = new DayItem({
                        start: item.start,
                        end: item.end,
                        day: i as DayNames
                    });
                    const newStoreHour = new StoreHour(store, newDay);
                    await this.storeHourService.add(newStoreHour);
                }
            }
            // Update item
            else {
                const storeHour = await this.storeHourService.getOne(item.id);
                if (!storeHour) throw new Error();
                const day = storeHour.day;
                if (!item.start || !item.end) {
                    await this.storeHourService.delete(storeHour);
                } else {
                    day.start = item.start;
                    day.end = item.end;
                }
            }
        }

        return store;
    }
}
