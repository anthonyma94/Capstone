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
var StoreService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreService = void 0;
const inversify_binding_decorators_1 = require("inversify-binding-decorators");
const BaseService_1 = require("./BaseService");
const Store_1 = __importDefault(require("../entities/Store"));
const decorators_1 = require("../utils/decorators");
const core_1 = require("@mikro-orm/core");
const StoreHour_1 = __importDefault(require("../entities/StoreHour"));
const DayItem_1 = __importDefault(require("../entities/DayItem"));
let StoreService = StoreService_1 = class StoreService extends BaseService_1.BaseService {
    storeHourRepo;
    constructor(repo, storeHourRepo) {
        super(repo);
        this.storeHourRepo = storeHourRepo;
    }
    getAll = async (options) => {
        const res = await this.repo.findAll({
            populate: {
                storeHours: { day: true }
            },
            ...options
        });
        return res;
    };
    changeHours = async (storeId, hours) => {
        for (const hour of hours) {
            if (!hour.id) {
                const dayItem = new DayItem_1.default({
                    start: hour.start.format("HH:mm"),
                    end: hour.end.format("HH:mm"),
                    day: hour.start.day()
                });
                const item = new StoreHour_1.default(storeId, dayItem);
                this.storeHourRepo.persist(item);
            }
            else {
                const item = await this.storeHourRepo.findOneOrFail({ id: hour.id }, ["day"]);
                item.day.start = hour.start.format("HH:mm");
                item.day.end = hour.end.format("HH:mm");
            }
        }
        await this.storeHourRepo.flush();
        return await this.storeHourRepo.find({ store: storeId }, ["day"]);
    };
};
StoreService = StoreService_1 = __decorate([
    (0, inversify_binding_decorators_1.provide)(StoreService_1),
    __param(0, (0, decorators_1.InjectRepo)(Store_1.default)),
    __param(1, (0, decorators_1.InjectRepo)(StoreHour_1.default)),
    __metadata("design:paramtypes", [core_1.EntityRepository,
        core_1.EntityRepository])
], StoreService);
exports.StoreService = StoreService;
//# sourceMappingURL=StoreService.js.map