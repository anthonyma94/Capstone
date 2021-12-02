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
var ScheduleService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const EntityRepository_1 = require("@mikro-orm/core/entity/EntityRepository");
const dayjs_1 = __importDefault(require("dayjs"));
const inversify_binding_decorators_1 = require("inversify-binding-decorators");
const Schedule_1 = __importDefault(require("../entities/Schedule"));
const ScheduleRule_1 = __importDefault(require("../entities/ScheduleRule"));
const decorators_1 = require("../utils/decorators");
const BaseService_1 = require("./BaseService");
const DayItem_1 = __importDefault(require("../entities/DayItem"));
const Person_1 = require("../entities/Person");
const ScheduleItem_1 = __importDefault(require("../entities/ScheduleItem"));
const inversify_1 = require("inversify");
const scheduler_1 = __importDefault(require("../utils/scheduler"));
const ScheduleRuleItem_1 = __importDefault(require("../entities/ScheduleRuleItem"));
let ScheduleService = ScheduleService_1 = class ScheduleService extends BaseService_1.BaseService {
    scheduleRuleRepo;
    scheduleRuleItemRepo;
    scheduleItemRepo;
    personRepo;
    scheduler;
    constructor(repo, scheduleRuleRepo, scheduleRuleItemRepo, scheduleItemRepo, personRepo, scheduler) {
        super(repo);
        this.scheduleRuleRepo = scheduleRuleRepo;
        this.scheduleRuleItemRepo = scheduleRuleItemRepo;
        this.scheduleItemRepo = scheduleItemRepo;
        this.personRepo = personRepo;
        this.scheduler = scheduler;
    }
    scheduleItemToEvent = async (item) => {
        if (!item.person.jobTitle || !item.person.jobTitle.name) {
            item.person.jobTitle = (await this.personRepo.findOneOrFail({ id: item.person.id }, [
                "jobTitle"
            ])).jobTitle;
        }
        const start = (0, dayjs_1.default)(`${(0, dayjs_1.default)(item.day.date)
            .utc()
            .format("YYYY-MM-DD")} ${item.day.start}`, "YYYY-MM-DD HH:mm");
        const end = (0, dayjs_1.default)(`${(0, dayjs_1.default)(item.day.date)
            .utc()
            .format("YYYY-MM-DD")} ${item.day.end}`, "YYYY-MM-DD HH:mm");
        const res = {
            id: item.id,
            start: start.toDate(),
            end: end.toDate(),
            title: `${start.format("hh:mm A")} - ${end.format("hh:mm A")}`,
            resourceId: item.person.id,
            extendedProps: {
                job: item.person.jobTitle.name,
                name: item.person.firstName + " " + item.person.lastName,
                schedule: item.schedule.id
            }
        };
        return res;
    };
    getRules = async () => {
        const res = await this.scheduleRuleRepo.findAll({
            populate: {
                day: true,
                rules: {
                    jobTitle: true
                }
            }
        });
        return res;
    };
    addScheduleItem = async (params) => {
        const schedule = await this.repo.findOne({ id: params.scheduleId });
        if (!schedule) {
            const weekStart = params.date.subtract(params.date.day(), "day");
            const weekEnd = weekStart.add(6, "day");
            const newSchedule = new Schedule_1.default({
                isDefault: false,
                start: new DayItem_1.default({
                    date: weekStart.toDate(),
                    start: "00:00",
                    end: "00:00"
                }),
                end: new DayItem_1.default({
                    date: weekEnd.toDate(),
                    start: "00:00",
                    end: "00:00"
                })
            });
            this.repo.persist(newSchedule);
            params.scheduleId = newSchedule.id;
        }
        const day = new DayItem_1.default({
            start: params.start,
            end: params.end,
            date: params.date.toDate()
        });
        const item = new ScheduleItem_1.default({
            day,
            schedule: params.scheduleId,
            person: params.personId
        });
        await this.scheduleItemRepo.persistAndFlush(item);
        return await this.scheduleItemToEvent(item);
    };
    getSchedule = async (start, user) => {
        const where = {
            start: {
                date: start.utc().format("YYYY-MM-DD")
            }
        };
        if (user !== "admin") {
            where.scheduleItems = {
                person: user
            };
        }
        const scheduleResp = await this.repo.findOne(where, [
            "scheduleItems.day",
            "scheduleItems.person",
            "scheduleItems.person.jobTitle"
        ]);
        if (!scheduleResp) {
            return null;
        }
        const response = [];
        for (const item of scheduleResp.scheduleItems) {
            response.push(await this.scheduleItemToEvent(item));
        }
        return { data: response, default: scheduleResp.isDefault };
    };
    editScheduleItem = async (params) => {
        const item = await this.scheduleItemRepo.findOneOrFail({
            id: params.id
        }, ["day"]);
        item.day.date = params.date;
        item.day.start = params.start;
        item.day.end = params.end;
        if (params.personId) {
            item.person = params.personId;
        }
        await this.scheduleItemRepo.flush();
    };
    deleteScheduleItem = async (id) => {
        const item = await this.scheduleItemRepo.findOneOrFail({ id });
        await this.scheduleItemRepo.removeAndFlush(item);
    };
    setDefaultSchedule = async (weekStart) => {
        const schedule = await this.repo.findOneOrFail({
            start: {
                date: weekStart.toDate()
            }
        });
        const defaultSchedule = await this.repo.find({ isDefault: true });
        if (!schedule) {
            throw new Error("No schedule exists.");
        }
        if (defaultSchedule.length > 0) {
            defaultSchedule.forEach(item => {
                item.isDefault = false;
            });
        }
        schedule.isDefault = true;
        await this.repo.flush();
    };
    createSchedule = async (scheduleStart) => {
        await this.scheduler.createSchedule(scheduleStart);
    };
    addOrEditScheduleRule = async (params) => {
        if (!params.id) {
            const scheduleRules = [];
            const ruleItems = [];
            const dayItems = [];
            if (params.days.length > 0) {
                for (const day of params.days) {
                    const dayItem = new DayItem_1.default({
                        start: params.start.format("HH:mm"),
                        end: params.end.format("HH:mm"),
                        day
                    });
                    dayItems.push(dayItem);
                }
            }
            else if (params.date) {
                const dayItem = new DayItem_1.default({
                    start: params.start.format("HH:mm"),
                    end: params.end.format("HH:mm"),
                    date: params.date.toDate()
                });
                dayItems.push(dayItem);
            }
            else
                throw new Error("Missing weekdays and date");
            for (const dayItem of dayItems) {
                const scheduleRule = new ScheduleRule_1.default({ day: dayItem });
                scheduleRules.push(scheduleRule);
            }
            for (const scheduleRule of scheduleRules) {
                for (const emp of params.employees) {
                    const ruleItem = new ScheduleRuleItem_1.default({
                        scheduleRule,
                        jobTitle: emp.jobId,
                        amount: emp.amount
                    });
                    ruleItems.push(ruleItem);
                    scheduleRule.rules.add(ruleItem);
                }
            }
            await this.scheduleRuleItemRepo.persistAndFlush(ruleItems);
            await this.scheduleRuleRepo.persistAndFlush(scheduleRules);
            const res = await this.scheduleRuleRepo.find({
                $or: scheduleRules.map(item => {
                    return {
                        id: item.id
                    };
                })
            }, {
                populate: ["rules.jobTitle", "day"]
            });
            return res;
        }
        else {
            const scheduleRules = [];
            const rule = await this.scheduleRuleRepo.findOneOrFail({ id: params.id }, ["day", "rules.jobTitle"]);
            scheduleRules.push(rule);
            if (params.days.length === 1) {
                rule.day.day = params.days[0];
            }
            else if (params.days.length > 1) {
                params.days = params.days.filter(x => x !== rule.day.day);
                for (const day of params.days) {
                    const newRule = new ScheduleRule_1.default({
                        day: new DayItem_1.default({
                            start: params.start.format("HH:mm"),
                            end: params.end.format("HH:mm"),
                            day
                        })
                    });
                    this.scheduleRuleRepo.persist(newRule);
                    scheduleRules.push(newRule);
                    for (const emp of params.employees) {
                        const item = new ScheduleRuleItem_1.default({
                            scheduleRule: newRule,
                            jobTitle: emp.jobId,
                            amount: emp.amount
                        });
                        this.scheduleRuleItemRepo.persist(item);
                    }
                }
                await this.scheduleRuleRepo.flush();
                await this.scheduleRuleItemRepo.flush();
            }
            if (params.date) {
                rule.day.date = params.date.toDate();
            }
            for (const emp of params.employees) {
                if (emp.id) {
                    const item = await this.scheduleRuleItemRepo.findOneOrFail({
                        id: emp.id
                    });
                    item.jobTitle = emp.jobId;
                    item.amount = emp.amount;
                }
            }
            await this.scheduleRuleRepo.flush();
            await this.scheduleRuleItemRepo.flush();
            const res = await this.scheduleRuleRepo.find({
                $or: scheduleRules.map(item => {
                    return {
                        id: item.id
                    };
                })
            }, {
                populate: ["rules.jobTitle", "day"]
            });
            return res;
        }
    };
    deleteScheduleRule = async (id) => {
        const item = await this.scheduleRuleRepo.findOneOrFail({ id }, [
            "rules",
            "day"
        ]);
        await this.scheduleRuleRepo.removeAndFlush(item);
    };
    getScheduleStartDates = async () => {
        const items = await this.repo.findAll({ populate: ["start"] });
        const res = items.map(item => item.start.date);
        return res;
    };
};
ScheduleService = ScheduleService_1 = __decorate([
    (0, inversify_binding_decorators_1.provide)(ScheduleService_1),
    __param(0, (0, decorators_1.InjectRepo)(Schedule_1.default)),
    __param(1, (0, decorators_1.InjectRepo)(ScheduleRule_1.default)),
    __param(2, (0, decorators_1.InjectRepo)(ScheduleRuleItem_1.default)),
    __param(3, (0, decorators_1.InjectRepo)(ScheduleItem_1.default)),
    __param(4, (0, decorators_1.InjectRepo)(Person_1.Person)),
    __param(5, (0, inversify_1.inject)(scheduler_1.default)),
    __metadata("design:paramtypes", [Object, EntityRepository_1.EntityRepository,
        EntityRepository_1.EntityRepository,
        EntityRepository_1.EntityRepository,
        EntityRepository_1.EntityRepository,
        scheduler_1.default])
], ScheduleService);
exports.default = ScheduleService;
//# sourceMappingURL=ScheduleService.js.map