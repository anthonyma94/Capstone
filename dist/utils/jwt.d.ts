import { NextFunction, Request, Response } from "express";
declare global {
    namespace Express {
        interface Request {
            currentUser: {
                user: string | undefined;
                role: string | undefined;
            };
        }
    }
}
export declare function generateAccessToken(params: {
    user: string;
    role: string;
}): string;
export declare function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function authorizeAdmin(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
