import { Request, Response, NextFunction } from "express";
import { BaseMiddleware } from "inversify-express-utils";
export default class AuthMiddleware extends BaseMiddleware {
    handler(req: Request, res: Response, next: NextFunction): void;
}
