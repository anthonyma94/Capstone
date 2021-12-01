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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const decorators_1 = require("../utils/decorators");
const BaseEntity_1 = __importDefault(require("./BaseEntity"));
const JobTitle_1 = require("./JobTitle");
const ScheduleRule_1 = __importDefault(require("./ScheduleRule"));
let ScheduleRuleItem = class ScheduleRuleItem extends BaseEntity_1.default {
    jobTitle;
    scheduleRule;
    amount;
    constructor(params) {
        super();
        this.jobTitle = params.jobTitle;
        this.scheduleRule = params.scheduleRule;
        this.amount = params.amount;
    }
};
__decorate([
    (0, core_1.ManyToOne)(),
    __metadata("design:type", JobTitle_1.JobTitle)
], ScheduleRuleItem.prototype, "jobTitle", void 0);
__decorate([
    (0, core_1.ManyToOne)(),
    __metadata("design:type", ScheduleRule_1.default)
], ScheduleRuleItem.prototype, "scheduleRule", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], ScheduleRuleItem.prototype, "amount", void 0);
ScheduleRuleItem = __decorate([
    (0, decorators_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], ScheduleRuleItem);
exports.default = ScheduleRuleItem;
//# sourceMappingURL=ScheduleRuleItem.js.map