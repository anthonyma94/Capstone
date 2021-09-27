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
const DayItem_1 = __importDefault(require("../entities/DayItem"));
const Store_1 = __importDefault(require("../entities/Store"));
const StoreHour_1 = __importDefault(require("../entities/StoreHour"));
const DayItemService_1 = __importDefault(require("../services/DayItemService"));
const StoreHourService_1 = __importDefault(require("../services/StoreHourService"));
const StoreService_1 = require("../services/StoreService");
const decorators_1 = require("../utils/decorators");
const BaseController_1 = require("./BaseController");
let StoreController = class StoreController extends BaseController_1.BaseController {
    dayItemService;
    storeHourService;
    constructor(service, dayItemService, storeHourService) {
        super(service);
        this.dayItemService = dayItemService;
        this.storeHourService = storeHourService;
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
    async changeHours(req, res, next) {
        if (!req.params.id)
            throw new Error("Please provide ID.");
        const store = await this.service.getOne(req.params.id);
        if (!store)
            throw new Error("No store found with given ID.");
        const body = req.body;
        if (!body)
            throw new Error("No body found.");
        for (let i = 0; i < body.length; i++) {
            const item = body[i];
            if (!item.id) {
                if (item.start && item.end) {
                    const newDay = new DayItem_1.default({
                        start: item.start,
                        end: item.end,
                        day: i
                    });
                    const newStoreHour = new StoreHour_1.default(store, newDay);
                    await this.storeHourService.add(newStoreHour);
                }
            }
            else {
                const storeHour = await this.storeHourService.getOne(item.id);
                if (!storeHour)
                    throw new Error();
                const day = storeHour.day;
                if (!item.start || !item.end) {
                    await this.storeHourService.delete(storeHour);
                }
                else {
                    day.start = item.start;
                    day.end = item.end;
                }
            }
        }
        return store;
    }
};
__decorate([
    (0, decorators_1.Post)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "add", null);
__decorate([
    (0, decorators_1.Put)("/changename/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "changeName", null);
__decorate([
    (0, decorators_1.Put)("/changehours/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], StoreController.prototype, "changeHours", null);
StoreController = __decorate([
    (0, decorators_1.Controller)(),
    __param(0, (0, inversify_1.inject)(StoreService_1.StoreService)),
    __param(1, (0, inversify_1.inject)(DayItemService_1.default)),
    __param(2, (0, inversify_1.inject)(StoreHourService_1.default)),
    __metadata("design:paramtypes", [StoreService_1.StoreService,
        DayItemService_1.default,
        StoreHourService_1.default])
], StoreController);
exports.default = StoreController;
