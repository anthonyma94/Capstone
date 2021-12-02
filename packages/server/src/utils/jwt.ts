/**
 * Handles all JWT authentication & authorization.
 */
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

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

// Creates an async method as the default verify is not async. Easier to use.
const asyncVerify = async (token: string) => {
    const promise = new Promise<any>((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET!, (err: any, data: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
    return await promise;
};

export function generateAccessToken(params: { user: string; role: string }) {
    return jwt.sign(params, process.env.JWT_SECRET!);
}

export async function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.cookies["jwt"];

    if (!token) {
        req.currentUser = {
            user: undefined,
            role: undefined
        };
    } else {
        const data = await asyncVerify(token);
        req.currentUser = data;
    }
    next();
}

export async function authorizeAdmin(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.currentUser?.role) {
        const token = req.cookies["jwt"];
        if (!token) {
            return res.status(403);
        }

        const data = await asyncVerify(token);
        req.currentUser = data;
    }

    if (req.currentUser.role !== "admin") {
        return res.status(404);
    }

    return next();
}
