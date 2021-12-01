"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const inversify_express_utils_1 = require("inversify-express-utils");
const Authentication_1 = __importDefault(require("../entities/Authentication"));
const decorators_1 = require("../utils/decorators");
const jwt_1 = require("../utils/jwt");
let AuthController = class AuthController extends inversify_express_utils_1.BaseHttpController {
    repo;
    constructor(repo) {
        super();
        this.repo = repo;
    }
    async getUser(req) {
        if (req.currentUser.user && req.currentUser.role) {
            return this.json(req.currentUser);
        }
        return this.json(null);
    }
    async login(req, res) {
        const { username, password } = req.body;
        if (!username) {
            throw new Error("Missing username.");
        }
        if (!password) {
            throw new Error("Missing password.");
        }
        const user = await this.repo.findOneOrFail({ username });
        const passwordValid = Authentication_1.default.checkPassword(password, user.password);
        if (!passwordValid) {
            return this.statusCode(403);
        }
        console.log(user.person?.id);
        const token = (0, jwt_1.generateAccessToken)({
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
    async logout(req, res) {
        res.clearCookie("jwt");
        return this.statusCode(200);
    }
};
__decorate([
    (0, decorators_1.Get)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUser", null);
__decorate([
    (0, decorators_1.Post)("/login"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, decorators_1.Get)("/logout"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, decorators_1.Controller)(),
    __param(0, (0, decorators_1.InjectRepo)(Authentication_1.default)),
    __metadata("design:paramtypes", [core_1.EntityRepository])
], AuthController);
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map