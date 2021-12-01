import { Request } from "express";
import { Person } from "../entities/Person";
import PersonService from "../services/PersonService";
import { BaseController } from "./BaseController";
export default class PersonController extends BaseController<PersonService, Person> {
    constructor(service: any);
    addAvailabilities(req: Request): Promise<import("inversify-express-utils/dts/results").JsonResult>;
    removeAvailabilities(req: Request): Promise<import("inversify-express-utils/dts/results").StatusCodeResult>;
    editAvailability(req: Request): Promise<import("inversify-express-utils/dts/results").JsonResult>;
    updatePerson(req: Request): Promise<import("inversify-express-utils/dts/results").JsonResult | import("inversify-express-utils/dts/results").BadRequestResult>;
}
