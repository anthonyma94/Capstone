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
var PersonService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const inversify_binding_decorators_1 = require("inversify-binding-decorators");
const Availability_1 = __importDefault(require("../entities/Availability"));
const Person_1 = require("../entities/Person");
const decorators_1 = require("../utils/decorators");
const BaseService_1 = require("./BaseService");
const DayItem_1 = __importDefault(require("../entities/DayItem"));
let PersonService = PersonService_1 = class PersonService extends BaseService_1.BaseService {
    availabilityRepo;
    constructor(repo, availabilityRepo) {
        super(repo);
        this.availabilityRepo = availabilityRepo;
    }
    getOne = async (id, options) => {
        const res = await this.repo.findOneOrFail(id, {
            populate: { jobTitle: true, availabilities: { day: true } },
            ...options
        });
        return res;
    };
    getAll = async (options) => {
        const res = await this.repo.findAll({
            populate: {
                jobTitle: true,
                availabilities: { day: true }
            },
            ...options
        });
        return res;
    };
    update = async (entity) => {
        const item = await this.getOne(entity.id);
        const data = entity;
        if (data.availabilities)
            delete data.availabilities;
        const res = (0, core_1.wrap)(item).assign(data, {
            merge: true,
            mergeObjects: true
        });
        this.repo.flush();
        return res;
    };
    addAvailabilities = async (id, availabilities) => {
        try {
            const person = await this.getOne(id);
            for (let i of availabilities) {
                const item = new Availability_1.default({
                    ...i,
                    day: new DayItem_1.default(i.day),
                    person
                });
                this.availabilityRepo.persist(item);
                person.availabilities.add(item);
            }
            await this.repo.flush();
            return person;
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    };
    deleteAvailability = async (availability) => {
        const item = await this.availabilityRepo.findOneOrFail({
            id: availability.id
        });
        await this.repo.removeAndFlush(item);
    };
    updateAvailability = async (availability) => {
        const person = await this.getOne(availability.person.id);
        if (!person)
            throw new Error("No person found with ID.");
        await this.repo.persistAndFlush(availability);
    };
};
PersonService = PersonService_1 = __decorate([
    (0, inversify_binding_decorators_1.provide)(PersonService_1),
    __param(0, (0, decorators_1.InjectRepo)(Person_1.Person)),
    __param(1, (0, decorators_1.InjectRepo)(Availability_1.default)),
    __metadata("design:paramtypes", [Object, core_1.EntityRepository])
], PersonService);
exports.default = PersonService;
