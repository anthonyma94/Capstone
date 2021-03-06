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
const StoreHour_1 = __importDefault(require("./StoreHour"));
let Store = class Store extends BaseEntity_1.default {
    name;
    storeHours = new core_1.Collection(this);
    constructor(name) {
        super();
        this.name = name;
    }
};
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Store.prototype, "name", void 0);
__decorate([
    (0, core_1.OneToMany)(() => StoreHour_1.default, storeHour => storeHour.store),
    __metadata("design:type", Object)
], Store.prototype, "storeHours", void 0);
Store = __decorate([
    (0, decorators_1.Entity)(),
    __metadata("design:paramtypes", [String])
], Store);
exports.default = Store;
//# sourceMappingURL=Store.js.map