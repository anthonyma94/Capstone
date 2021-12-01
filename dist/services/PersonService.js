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
const Authentication_1 = __importDefault(require("../entities/Authentication"));
let PersonService = PersonService_1 = class PersonService extends BaseService_1.BaseService {
    availabilityRepo;
    authRepo;
    constructor(repo, availabilityRepo, authRepo) {
        super(repo);
        this.availabilityRepo = availabilityRepo;
        this.authRepo = authRepo;
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
    addAvailabilities = async (params) => {
        const availabilities = [];
        for (const i of params.availabilities) {
            const item = new Availability_1.default({
                person: params.personId,
                isApproved: true,
                day: new DayItem_1.default({
                    start: i.start,
                    end: i.end,
                    day: i.day
                })
            });
            availabilities.push(item);
        }
        await this.availabilityRepo.persistAndFlush(availabilities);
        const res = await this.availabilityRepo.find({ id: { $in: availabilities.map(x => x.id) } }, ["day"]);
        return res;
    };
    deleteAvailability = async (id) => {
        const items = await this.availabilityRepo.findOneOrFail({ id });
        await this.availabilityRepo.removeAndFlush(items);
    };
    editAvailability = async (params) => {
        const item = await this.availabilityRepo.findOneOrFail({ id: params.id }, ["day"]);
        item.day.start = params.start.format("HH:mm");
        item.day.end = params.end.format("HH:mm");
        item.day.day = params.day;
        await this.availabilityRepo.flush();
        return item;
    };
    updatePerson = async (params) => {
        if (params.id !== "new") {
            const item = await this.repo.findOneOrFail({ id: params.id });
            item.firstName = params.firstName;
            item.lastName = params.lastName;
            item.address = params.address;
            item.province = params.province;
            item.postal = params.postal;
            item.city = params.city;
            item.phone = params.phone;
            item.pay = params.pay;
            item.maxWeeklyHours = params.maxWeeklyHours;
            item.jobTitle = params.jobTitle;
            item.role = params.role;
        }
        else {
            const item = new Person_1.Person({
                firstName: params.firstName.charAt(0).toUpperCase() +
                    params.firstName.slice(1).toLowerCase(),
                lastName: params.lastName.charAt(0).toUpperCase() +
                    params.lastName.slice(1).toLowerCase(),
                address: params.address,
                province: params.province,
                city: params.city,
                postal: params.postal,
                role: params.role,
                pay: params.pay,
                phone: params.phone,
                maxWeeklyHours: params.maxWeeklyHours,
                jobTitle: params.jobTitle
            });
            const auth = new Authentication_1.default({
                person: item,
                username: item.firstName.charAt(0).toLowerCase() +
                    item.lastName.toLowerCase(),
                password: "password",
                role: "user"
            });
            this.repo.persist(item);
            await this.authRepo.persistAndFlush(auth);
            params.id = item.id;
        }
        await this.repo.flush();
        const res = await this.repo.findOneOrFail({ id: params.id }, [
            "availabilities.day",
            "jobTitle"
        ]);
        return res;
    };
};
PersonService = PersonService_1 = __decorate([
    (0, inversify_binding_decorators_1.provide)(PersonService_1),
    __param(0, (0, decorators_1.InjectRepo)(Person_1.Person)),
    __param(1, (0, decorators_1.InjectRepo)(Availability_1.default)),
    __param(2, (0, decorators_1.InjectRepo)(Authentication_1.default)),
    __metadata("design:paramtypes", [Object, core_1.EntityRepository,
        core_1.EntityRepository])
], PersonService);
exports.default = PersonService;
//# sourceMappingURL=PersonService.js.map