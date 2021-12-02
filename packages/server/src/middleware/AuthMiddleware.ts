/**
 * Used to authorize various functions. This class is needed for DI to function.
 */

import { Request, Response, NextFunction } from "express";
import { provide } from "inversify-binding-decorators";
import { BaseMiddleware } from "inversify-express-utils";
import { authorizeAdmin } from "../utils/jwt";

@provide(AuthMiddleware)
export default class AuthMiddleware extends BaseMiddleware {
    handler(req: Request, res: Response, next: NextFunction): void {
        authorizeAdmin(req, res, next);
    }
}
