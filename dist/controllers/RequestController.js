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
const RequestService_1 = __importDefault(require("../services/RequestService"));
const decorators_1 = require("../utils/decorators");
let RequestController = class RequestController extends inversify_express_utils_1.BaseHttpController {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
    async getTimeOff(req) {
        if (req.currentUser.role === "admin") {
            const res = await this.service.getTimeOffRequest();
            return this.json(res);
        }
        else {
            if (!req.currentUser.user)
                throw new Error("Missing user.");
            const res = await this.service.getTimeOffRequest(req.currentUser.user);
            return this.json(res);
        }
    }
    async submitTimeOff(req) {
        const user = req.currentUser;
        if (!user.user)
            throw new Error("Missing user.");
        const params = req.body;
        params.start = (0, dayjs_1.default)(params.start);
        params.end = (0, dayjs_1.default)(params.end);
        const res = await this.service.createTimeOffRequest({
            person: user.user,
            ...params
        });
        return this.json(res);
    }
    async approveTimeOff(req) {
        const params = {
            id: req.body.id,
            decision: req.body.action === "approve"
        };
        const res = await this.service.approveOrDenyTimeOffRequest(params.id, params.decision);
        return this.json(res);
    }
};
__decorate([
    (0, decorators_1.Get)("/timeoff"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RequestController.prototype, "getTimeOff", null);
__decorate([
    (0, decorators_1.Post)("/timeoff"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RequestController.prototype, "submitTimeOff", null);
__decorate([
    (0, decorators_1.Put)("/timeoff/approve", AuthMiddleware_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RequestController.prototype, "approveTimeOff", null);
RequestController = __decorate([
    (0, decorators_1.Controller)(),
    __param(0, (0, inversify_1.inject)(RequestService_1.default)),
    __metadata("design:paramtypes", [RequestService_1.default])
], RequestController);
exports.default = RequestController;
//# sourceMappingURL=RequestController.js.map