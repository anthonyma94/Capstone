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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const inversify_1 = require("inversify");
const inversify_express_utils_1 = require("inversify-express-utils");
const decorators_1 = require("../utils/decorators");
let BaseController = class BaseController extends inversify_express_utils_1.BaseHttpController {
    service;
    constructor(_service) {
        super();
        this.service = _service;
    }
    async get(req, res, next) {
        const result = await this.service.getAll();
        return this.json(result);
    }
    async find(req, res, next) {
        const result = await this.service.getOne(req.params.id);
        return this.json(result);
    }
    async delete(req, res, next) {
        const item = await this.service.getOne(req.params.id);
        if (!item)
            throw new Error("Item with ID not found.");
        await this.service.delete(item);
        return this.json(item, 200);
    }
};
__decorate([
    (0, decorators_1.Get)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "get", null);
__decorate([
    (0, decorators_1.Get)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "find", null);
__decorate([
    (0, decorators_1.Delete)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "delete", null);
BaseController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [Object])
], BaseController);
exports.BaseController = BaseController;
