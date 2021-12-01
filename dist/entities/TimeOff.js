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
const DayItem_1 = __importDefault(require("./DayItem"));
const Person_1 = require("./Person");
let TimeOff = class TimeOff extends BaseEntity_1.default {
    person;
    reason;
    start;
    end;
    isApproved;
    constructor(params) {
        super();
        this.person = params.person;
        this.reason = params.reason;
        this.start = params.start;
        this.end = params.end;
        this.isApproved = params.isApproved;
    }
};
__decorate([
    (0, core_1.ManyToOne)(),
    __metadata("design:type", Person_1.Person)
], TimeOff.prototype, "person", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], TimeOff.prototype, "reason", void 0);
__decorate([
    (0, core_1.ManyToOne)(),
    __metadata("design:type", DayItem_1.default)
], TimeOff.prototype, "start", void 0);
__decorate([
    (0, core_1.ManyToOne)(),
    __metadata("design:type", DayItem_1.default)
], TimeOff.prototype, "end", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Boolean)
], TimeOff.prototype, "isApproved", void 0);
TimeOff = __decorate([
    (0, decorators_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], TimeOff);
exports.default = TimeOff;
//# sourceMappingURL=TimeOff.js.map