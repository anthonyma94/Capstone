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
exports.Person = void 0;
const core_1 = require("@mikro-orm/core");
const inversify_1 = require("inversify");
const decorators_1 = require("../utils/decorators");
const Availability_1 = __importDefault(require("./Availability"));
const BaseEntity_1 = __importDefault(require("./BaseEntity"));
const JobTitle_1 = require("./JobTitle");
const ScheduleItem_1 = __importDefault(require("./ScheduleItem"));
const TimeOff_1 = __importDefault(require("./TimeOff"));
let Person = class Person extends BaseEntity_1.default {
    firstName;
    lastName;
    address;
    city;
    province;
    postal;
    role;
    pay;
    phone;
    maxWeeklyHours;
    jobTitle;
    timeOffs = new core_1.Collection(this);
    availabilities = new core_1.Collection(this);
    scheduleItems = new core_1.Collection(this);
    constructor(params) {
        super();
        this.firstName = params.firstName;
        this.lastName = params.lastName;
        this.address = params.address;
        this.province = params.province;
        this.city = params.city;
        this.postal = params.postal;
        this.role = params.role;
        this.phone = params.phone;
        this.pay = params.pay;
        this.maxWeeklyHours = params.maxWeeklyHours;
        this.jobTitle = params.jobTitle;
    }
};
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Person.prototype, "firstName", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Person.prototype, "lastName", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Person.prototype, "address", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Person.prototype, "city", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Person.prototype, "province", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Person.prototype, "postal", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Person.prototype, "role", void 0);
__decorate([
    (0, core_1.Property)({ columnType: "float" }),
    __metadata("design:type", Number)
], Person.prototype, "pay", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Person.prototype, "phone", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], Person.prototype, "maxWeeklyHours", void 0);
__decorate([
    (0, core_1.ManyToOne)(),
    __metadata("design:type", JobTitle_1.JobTitle)
], Person.prototype, "jobTitle", void 0);
__decorate([
    (0, core_1.OneToMany)(() => TimeOff_1.default, time => time.person),
    __metadata("design:type", Object)
], Person.prototype, "timeOffs", void 0);
__decorate([
    (0, core_1.OneToMany)(() => Availability_1.default, availability => availability.person),
    __metadata("design:type", Object)
], Person.prototype, "availabilities", void 0);
__decorate([
    (0, core_1.OneToMany)(() => ScheduleItem_1.default, x => x.person),
    __metadata("design:type", Object)
], Person.prototype, "scheduleItems", void 0);
Person = __decorate([
    (0, decorators_1.Entity)(),
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [Object])
], Person);
exports.Person = Person;
//# sourceMappingURL=Person.js.map