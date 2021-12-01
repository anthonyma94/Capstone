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
var Authentication_1;
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const decorators_1 = require("../utils/decorators");
const BaseEntity_1 = __importDefault(require("./BaseEntity"));
const Person_1 = require("./Person");
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 10;
let Authentication = Authentication_1 = class Authentication extends BaseEntity_1.default {
    person;
    username;
    password;
    role;
    constructor(options) {
        super();
        this.person = options.person;
        this.username = options.username;
        this.password = Authentication_1.encryptPassword(options.password);
        this.role = options.role;
    }
    static encryptPassword(text) {
        return bcrypt_1.default.hashSync(text, SALT_ROUNDS);
    }
    static checkPassword(text, hashedPassword) {
        return bcrypt_1.default.compareSync(text, hashedPassword);
    }
};
__decorate([
    (0, core_1.OneToOne)(),
    __metadata("design:type", Person_1.Person)
], Authentication.prototype, "person", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Authentication.prototype, "username", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Authentication.prototype, "password", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Authentication.prototype, "role", void 0);
Authentication = Authentication_1 = __decorate([
    (0, decorators_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Authentication);
exports.default = Authentication;
//# sourceMappingURL=Authentication.js.map