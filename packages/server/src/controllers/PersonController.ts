import dayjs from "dayjs";
import { Request } from "express";
import { inject } from "inversify";
import { Person } from "../entities/Person";
import AuthMiddleware from "../middleware/AuthMiddleware";
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

    @Post("/:id/availability", AuthMiddleware)
    public async addAvailabilities(req: Request) {
        const res = await this.service.addAvailabilities({
            personId: req.params.id,
            availabilities: req.body
        });
        return this.json(res);
    }

    @Delete("/:personid/availability/:id", AuthMiddleware)
    public async removeAvailabilities(req: Request) {
        await this.service.deleteAvailability(req.params.id);
        return this.statusCode(200);
    }

    @Put("/:id/availability", AuthMiddleware)
    public async editAvailability(req: Request) {
        const data = req.body;
        data.start = dayjs(data.start, ["hh:mm A", "HH:mm"]);
        data.end = dayjs(data.end, ["hh:mm A", "HH:mm"]);

        const res = await this.service.editAvailability(data);

        return this.json(res);
    }

    @Put("/:id", AuthMiddleware)
    public async updatePerson(req: Request) {
        try {
            const res = await this.service.updatePerson(req.body);
            return this.json(res, 200);
        } catch (e) {
            console.error(e);
            return this.badRequest();
        }
    }
}
