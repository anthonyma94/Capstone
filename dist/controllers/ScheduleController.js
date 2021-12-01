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
const inversify_express_utils_1 = require("inversify-express-utils");
const AuthMiddleware_1 = __importDefault(require("../middleware/AuthMiddleware"));
const ScheduleService_1 = __importDefault(require("../services/ScheduleService"));
const decorators_1 = require("../utils/decorators");
let ScheduleController = class ScheduleController extends inversify_express_utils_1.BaseHttpController {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
    async getRules() {
        const resp = await this.service.getRules();
        return this.json(resp, 200);
    }
    async getScheduleStartDates() {
        const res = await this.service.getScheduleStartDates();
        return this.json(res, 200);
    }
    async getSchedule(req) {
        const q = req.query;
        const start = (0, dayjs_1.default)(q.start);
        if (!start.isValid()) {
            throw new Error("Invalid start date.");
        }
        if (req.method.toUpperCase() === "POST") {
            await this.service.createSchedule(start);
        }
        const user = req.currentUser;
        const resp = await this.service.getSchedule(start, user.user || "admin");
        return this.json(resp, 200);
    }
    async editScheduleItem(req) {
        const date = new Date(req.body.date);
        await this.service.editScheduleItem({
            ...req.body,
            date
        });
        return this.statusCode(200);
    }
    async addScheduleItem(req) {
        const payload = {
            ...req.body,
            date: (0, dayjs_1.default)(req.body.date)
        };
        const res = await this.service.addScheduleItem(payload);
        return this.json(res);
    }
    async deleteScheduleItem(req) {
        await this.service.deleteScheduleItem(req.query.id);
        return this.statusCode(204);
    }
    async setDefaultSchedule(req) {
        const date = req.body.date;
        if (!date || !(0, dayjs_1.default)(date).isValid()) {
            throw new Error("Invalid date.");
        }
        await this.service.setDefaultSchedule((0, dayjs_1.default)(date));
    }
    async addScheduleRule(req) {
        const data = req.body;
        data.start = (0, dayjs_1.default)(data.start);
        data.end = (0, dayjs_1.default)(data.end);
        if (data.date) {
            data.date = (0, dayjs_1.default)(data.date);
        }
        const res = await this.service.addScheduleRule(data);
        return this.json(res);
    }
    async deleteScheduleRule(req) {
        const id = req.params.id;
        await this.service.deleteScheduleRule(id);
        return this.statusCode(200);
    }
};
__decorate([
    (0, decorators_1.Get)("/rules", AuthMiddleware_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "getRules", null);
__decorate([
    (0, decorators_1.Get)("/startdates", AuthMiddleware_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "getScheduleStartDates", null);
__decorate([
    (0, decorators_1.Get)("/"),
    (0, decorators_1.Post)("/", AuthMiddleware_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "getSchedule", null);
__decorate([
    (0, decorators_1.Put)("/item", AuthMiddleware_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "editScheduleItem", null);
__decorate([
    (0, decorators_1.Post)("/item", AuthMiddleware_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "addScheduleItem", null);
__decorate([
    (0, decorators_1.Delete)("/item", AuthMiddleware_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "deleteScheduleItem", null);
__decorate([
    (0, decorators_1.Post)("/default", AuthMiddleware_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "setDefaultSchedule", null);
__decorate([
    (0, decorators_1.Post)("/rules", AuthMiddleware_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "addScheduleRule", null);
__decorate([
    (0, decorators_1.Delete)("/rules/:id", AuthMiddleware_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "deleteScheduleRule", null);
ScheduleController = __decorate([
    (0, decorators_1.Controller)(),
    __param(0, (0, inversify_1.inject)(ScheduleService_1.default)),
    __metadata("design:paramtypes", [ScheduleService_1.default])
], ScheduleController);
exports.default = ScheduleController;
//# sourceMappingURL=ScheduleController.js.map