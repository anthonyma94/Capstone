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
const inversify_1 = require("inversify");
const JobTitle_1 = require("../entities/JobTitle");
const JobTitleService_1 = __importDefault(require("../services/JobTitleService"));
const decorators_1 = require("../utils/decorators");
const BaseController_1 = require("./BaseController");
let JobTitleController = class JobTitleController extends BaseController_1.BaseController {
    constructor(service) {
        super(service);
    }
    async add(req, res, next) {
        if (!req.body || !req.body.name) {
            throw new Error("Store must have a name.");
        }
        const title = new JobTitle_1.JobTitle(req.body.name);
        const result = await this.service.add(title);
        return this.json(result, 201);
    }
};
__decorate([
    (0, decorators_1.Post)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], JobTitleController.prototype, "add", null);
JobTitleController = __decorate([
    (0, decorators_1.Controller)(),
    __param(0, (0, inversify_1.inject)(JobTitleService_1.default)),
    __metadata("design:paramtypes", [Object])
], JobTitleController);
exports.default = JobTitleController;
