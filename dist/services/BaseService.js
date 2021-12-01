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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const core_1 = require("@mikro-orm/core");
const inversify_1 = require("inversify");
let BaseService = class BaseService {
    repo;
    constructor(_repo) {
        this.repo = _repo;
    }
    getAll = async (options) => {
        return await this.repo.findAll(options);
    };
    getOne = async (id, populate, orderBy) => {
        return await this.repo.findOneOrFail(id, populate, orderBy);
    };
    find = async (where, populate, orderBy) => {
        return await this.repo.findOneOrFail(where, populate, orderBy);
    };
    add = async (entity) => {
        await this.repo.persistAndFlush(entity);
        return entity;
    };
    update = async (entity) => {
        const item = await this.getOne(entity.id);
        (0, core_1.wrap)(item).assign(entity, {
            merge: true,
            mergeObjects: true,
            updateNestedEntities: true
        });
        await this.repo.flush();
        return item;
    };
    delete = async (entity) => {
        await this.repo.removeAndFlush(entity);
        return entity;
    };
};
BaseService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [Object])
], BaseService);
exports.BaseService = BaseService;
//# sourceMappingURL=BaseService.js.map