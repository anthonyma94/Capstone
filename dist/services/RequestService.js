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
var RequestService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const inversify_binding_decorators_1 = require("inversify-binding-decorators");
const DayItem_1 = __importDefault(require("../entities/DayItem"));
const Person_1 = require("../entities/Person");
const TimeOff_1 = __importDefault(require("../entities/TimeOff"));
const decorators_1 = require("../utils/decorators");
let RequestService = RequestService_1 = class RequestService {
    timeOffRepo;
    personRepo;
    constructor(timeOffRepo, personRepo) {
        this.timeOffRepo = timeOffRepo;
        this.personRepo = personRepo;
    }
    async getTimeOffRequest(person) {
        const items = person
            ? await this.timeOffRepo.find({ person }, ["start", "end"])
            : await this.timeOffRepo.findAll({ populate: ["start", "end"] });
        return items;
    }
    async createTimeOffRequest(params) {
        const person = await this.personRepo.findOneOrFail({
            id: params.person
        });
        const start = new DayItem_1.default({
            start: params.start.format("HH:mm"),
            end: params.start.format("HH:mm"),
            date: params.end.format("YYYY-MM-DD")
        });
        const end = new DayItem_1.default({
            start: params.end.format("HH:mm"),
            end: params.end.format("HH:mm"),
            date: params.end.format("YYYY-MM-DD")
        });
        const item = new TimeOff_1.default({ person, start, end, reason: params.reason });
        this.timeOffRepo.persist(item);
        await this.timeOffRepo.flush();
        const res = await this.timeOffRepo.findOneOrFail({ id: item.id }, [
            "start",
            "end"
        ]);
        return res;
    }
    async approveOrDenyTimeOffRequest(id, decision) {
        const item = await this.timeOffRepo.findOneOrFail({ id });
        item.isApproved = decision;
        await this.timeOffRepo.flush();
        return item;
    }
};
RequestService = RequestService_1 = __decorate([
    (0, inversify_binding_decorators_1.provide)(RequestService_1),
    __param(0, (0, decorators_1.InjectRepo)(TimeOff_1.default)),
    __param(1, (0, decorators_1.InjectRepo)(Person_1.Person)),
    __metadata("design:paramtypes", [core_1.EntityRepository,
        core_1.EntityRepository])
], RequestService);
exports.default = RequestService;
//# sourceMappingURL=RequestService.js.map