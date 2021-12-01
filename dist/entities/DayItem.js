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
exports.DayNames = void 0;
const core_1 = require("@mikro-orm/core");
const decorators_1 = require("../utils/decorators");
const mikro_orm_config_1 = require("../config/mikro-orm.config");
const BaseEntity_1 = __importDefault(require("./BaseEntity"));
let DayItem = class DayItem extends BaseEntity_1.default {
    day;
    date;
    start;
    end;
    constructor(params) {
        super();
        const { start, end, day, date } = params;
        if (day === undefined && !date) {
            throw new Error("DayItem must have either a day or date.");
        }
        this.day = day;
        this.date = date;
        this.start = start;
        this.end = end;
    }
};
__decorate([
    (0, core_1.Enum)(),
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], DayItem.prototype, "day", void 0);
__decorate([
    (0, core_1.Property)({ type: core_1.DateType }),
    __metadata("design:type", Date)
], DayItem.prototype, "date", void 0);
__decorate([
    (0, core_1.Property)({ type: mikro_orm_config_1.TimeType }),
    __metadata("design:type", String)
], DayItem.prototype, "start", void 0);
__decorate([
    (0, core_1.Property)({ type: mikro_orm_config_1.TimeType }),
    __metadata("design:type", String)
], DayItem.prototype, "end", void 0);
DayItem = __decorate([
    (0, decorators_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], DayItem);
exports.default = DayItem;
var DayNames;
(function (DayNames) {
    DayNames[DayNames["SUNDAY"] = 0] = "SUNDAY";
    DayNames[DayNames["MONDAY"] = 1] = "MONDAY";
    DayNames[DayNames["TUESDAY"] = 2] = "TUESDAY";
    DayNames[DayNames["WEDNESDAY"] = 3] = "WEDNESDAY";
    DayNames[DayNames["THURSDAY"] = 4] = "THURSDAY";
    DayNames[DayNames["FRIDAY"] = 5] = "FRIDAY";
    DayNames[DayNames["SATURDAY"] = 6] = "SATURDAY";
})(DayNames = exports.DayNames || (exports.DayNames = {}));
//# sourceMappingURL=DayItem.js.map