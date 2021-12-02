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
const Store_1 = __importDefault(require("../entities/Store"));
const AuthMiddleware_1 = __importDefault(require("../middleware/AuthMiddleware"));
const StoreService_1 = require("../services/StoreService");
const decorators_1 = require("../utils/decorators");
const BaseController_1 = require("./BaseController");
let StoreController = class StoreController extends BaseController_1.BaseController {
    constructor(service) {
        super(service);
    }
    async add(req, res, next) {
        if (!req.body || !req.body.name) {
            throw new Error("Store must have a name.");
        }
        const store = new Store_1.default(req.body.name);
        const result = await this.service.add(store);
        return this.json(result, 201);
    }
    async changeName(req, res, next) {
        if (!req.params.id) {
            throw new Error("Please provide ID.");
        }
        if (!req.body.name) {
            throw new Error("Please provide name.");
        }
        const store = await this.service.getOne(req.params.id);
        if (!store) {
            throw new Error("No store found with given ID.");
        }
        store.name = req.body.name;
        const result = await this.service.update(store);
        return this.json(result);
    }
    async changeHours(req) {
        const data = req.body.map((item) => {
            return {
                id: item.id,
                start: (0, dayjs_1.default)(item.start),
                end: (0, dayjs_1.default)(item.end)
            };
        });
        if (data.some((item) => !item.start.isValid() || !item.end.isValid()))
            throw new Error("Invalid dates.");
        const res = await this.service.changeHours(req.params.id, data);
        return this.json(res);
    }
};
__decorate([
    (0, decorators_1.Post)("/", AuthMiddleware_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "add", null);
__decorate([
    (0, decorators_1.Put)("/changename/:id", AuthMiddleware_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "changeName", null);
__decorate([
    (0, decorators_1.Put)("/changehours/:id", AuthMiddleware_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "changeHours", null);
StoreController = __decorate([
    (0, decorators_1.Controller)(),
    __param(0, (0, inversify_1.inject)(StoreService_1.StoreService)),
    __metadata("design:paramtypes", [StoreService_1.StoreService])
], StoreController);
exports.default = StoreController;
//# sourceMappingURL=StoreController.js.map