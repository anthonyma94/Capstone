import { NextFunction, Request, Response } from "express";
import { Person } from "../entities/Person";
import PersonService from "../services/PersonService";
import { BaseController } from "./BaseController";
export default class PersonController extends BaseController<PersonService, Person> {
    constructor(service: any);
    addAvailabilities(req: Request, res: Response, next: NextFunction): Promise<import("inversify-express-utils/dts/results").JsonResult | import("inversify-express-utils/dts/results").BadRequestResult>;
    removeAvailabilities(req: Request, res: Response, next: NextFunction): Promise<import("inversify-express-utils/dts/results").StatusCodeResult | import("inversify-express-utils/dts/results").BadRequestErrorMessageResult>;
    updatePerson(req: Request, res: Response, next: NextFunction): Promise<import("inversify-express-utils/dts/results").JsonResult | import("inversify-express-utils/dts/results").BadRequestResult>;
}
