import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { Person } from "../entities/Person";
import PersonService from "../services/PersonService";
import { Controller, Delete, Post, Put } from "../utils/decorators";
import { BaseController } from "./BaseController";

@Controller()
export default class PersonController extends BaseController<
    PersonService,
    Person
> {
    constructor(@inject(PersonService) service: any) {
        super(service);
    }

    @Post("/:id/availability")
    public async addAvailabilities(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const res = await this.service.addAvailabilities(
                req.params.id,
                req.body
            );
            return this.json(res);
        } catch (e) {
            return this.badRequest();
        }
    }

    @Delete("/:id/availability")
    public async removeAvailabilities(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            await this.service.deleteAvailability(req.body);

            return this.statusCode(200);
        } catch (e) {
            return this.badRequest(e as string);
        }
    }

    @Put("/:id")
    public async updatePerson(req: Request, res: Response, next: NextFunction) {
        try {
            const res = await this.service.update(req.body);
            return this.json(res, 200);
        } catch (e) {
            console.error(e);
            return this.badRequest();
        }
    }
}
