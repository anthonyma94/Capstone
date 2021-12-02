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
const dayjs_1 = __importDefault(require("dayjs"));
const inversify_1 = require("inversify");
const AuthMiddleware_1 = __importDefault(require("../middleware/AuthMiddleware"));
const PersonService_1 = __importDefault(require("../services/PersonService"));
const decorators_1 = require("../utils/decorators");
const BaseController_1 = require("./BaseController");
let PersonController = class PersonController extends BaseController_1.BaseController {
    constructor(service) {
        super(service);
    }
    async addAvailabilities(req) {
        const res = await this.service.addAvailabilities({
            personId: req.params.id,
            availabilities: req.body
        });
        return this.json(res);
    }
    async removeAvailabilities(req) {
        await this.service.deleteAvailability(req.params.id);
        return this.statusCode(200);
    }
    async editAvailability(req) {
        const data = req.body;
        data.start = (0, dayjs_1.default)(data.start, ["hh:mm A", "HH:mm"]);
        data.end = (0, dayjs_1.default)(data.end, ["hh:mm A", "HH:mm"]);
        const res = await this.service.editAvailability(data);
        return this.json(res);
    }
    async updatePerson(req) {
        try {
            const res = await this.service.addOrUpdatePerson(req.body);
            return this.json(res, 200);
        }
        catch (e) {
            console.error(e);
            return this.badRequest();
        }
    }
};
__decorate([
    (0, decorators_1.Post)("/:id/availability", AuthMiddleware_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PersonController.prototype, "addAvailabilities", null);
__decorate([
    (0, decorators_1.Delete)("/:personid/availability/:id", AuthMiddleware_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PersonController.prototype, "removeAvailabilities", null);
__decorate([
    (0, decorators_1.Put)("/:id/availability", AuthMiddleware_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PersonController.prototype, "editAvailability", null);
__decorate([
    (0, decorators_1.Put)("/:id", AuthMiddleware_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PersonController.prototype, "updatePerson", null);
PersonController = __decorate([
    (0, decorators_1.Controller)(),
    __param(0, (0, inversify_1.inject)(PersonService_1.default)),
    __metadata("design:paramtypes", [Object])
], PersonController);
exports.default = PersonController;
//# sourceMappingURL=PersonController.js.map