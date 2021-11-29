import { EntityRepository } from "@mikro-orm/core";
import { Request, Response } from "express";
import { BaseHttpController } from "inversify-express-utils";
import Authentication from "../entities/Authentication";
import { Controller, Get, InjectRepo, Post } from "../utils/decorators";
import { authenticateToken, generateAccessToken } from "../utils/jwt";

@Controller()
export default class AuthController extends BaseHttpController {
    constructor(
        @InjectRepo(Authentication)
        private repo: EntityRepository<Authentication>
    ) {
        super();
    }

    @Get("/")
    public async getUser(req: Request) {
        if (req.currentUser.user && req.currentUser.role) {
            return this.json(req.currentUser);
        }
        return this.json(null);
    }

    @Post("/login")
    public async login(req: Request, res: Response) {
        const { username, password } = req.body;

        if (!username) {
            throw new Error("Missing username.");
        }

        if (!password) {
            throw new Error("Missing password.");
        }

        const user = await this.repo.findOneOrFail({ username });
        const passwordValid = Authentication.checkPassword(
            password,
            user.password
        );

        if (!passwordValid) {
            return this.statusCode(403);
        }

        console.log(user.person?.id);

        const token = generateAccessToken({
            user: user.person?.id || username,
            role: user.role
        });

        res.cookie("jwt", token, {
            httpOnly: true
        });

        return this.json({
            user: username,
            role: user.role
        });
    }

    @Get("/logout")
    public async logout(req: Request, res: Response) {
        res.clearCookie("jwt");

        return this.statusCode(200);
    }
}
