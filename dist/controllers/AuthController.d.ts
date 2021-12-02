import { EntityRepository } from "@mikro-orm/core";
import { Request, Response } from "express";
import { BaseHttpController } from "inversify-express-utils";
import Authentication from "../entities/Authentication";
export default class AuthController extends BaseHttpController {
    private repo;
    constructor(repo: EntityRepository<Authentication>);
    getUser(req: Request): Promise<import("inversify-express-utils/dts/results").JsonResult>;
    login(req: Request, res: Response): Promise<import("inversify-express-utils/dts/results").JsonResult | import("inversify-express-utils/dts/results").StatusCodeResult | import("inversify-express-utils/dts/results").BadRequestResult>;
    logout(req: Request, res: Response): Promise<import("inversify-express-utils/dts/results").StatusCodeResult>;
}
