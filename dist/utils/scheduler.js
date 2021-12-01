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
var Scheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const dayjs_1 = __importDefault(require("dayjs"));
const inversify_binding_decorators_1 = require("inversify-binding-decorators");
const DayItem_1 = __importDefault(require("../entities/DayItem"));
const Person_1 = require("../entities/Person");
const Schedule_1 = __importDefault(require("../entities/Schedule"));
const ScheduleItem_1 = __importDefault(require("../entities/ScheduleItem"));
const ScheduleRule_1 = __importDefault(require("../entities/ScheduleRule"));
const decorators_1 = require("./decorators");
let Scheduler = Scheduler_1 = class Scheduler {
    repo;
    scheduleRuleRepo;
    personRepo;
    scheduleItemRepo;
    constructor(repo, scheduleRuleRepo, personRepo, scheduleItemRepo) {
        this.repo = repo;
        this.scheduleRuleRepo = scheduleRuleRepo;
        this.personRepo = personRepo;
        this.scheduleItemRepo = scheduleItemRepo;
    }
    async createSchedule(scheduleStart) {
        function checkTimeOff(timeoffs, start, end) {
            let result = false;
            if (timeoffs.length > 0) {
                for (const timeOff of timeoffs) {
                    result = !(timeOff.end.isBefore(start) ||
                        timeOff.start.isAfter(end));
                    if (result)
                        break;
                }
            }
            return result;
        }
        if (scheduleStart.day() !== 0) {
            throw new Error("Schedule must start on a Sunday.");
        }
        const defaultSchedule = await this.repo.findOne({ isDefault: true });
        const scheduleEnd = scheduleStart.add(7, "day").subtract(1, "minute");
        const schedule = new Schedule_1.default({
            isDefault: false,
            start: new DayItem_1.default({
                start: "00:00",
                end: "00:00",
                date: scheduleStart.toDate()
            }),
            end: new DayItem_1.default({
                start: "00:00",
                end: "00:00",
                date: scheduleEnd.toDate()
            })
        });
        this.repo.persist(schedule);
        const allRules = await this.scheduleRuleRepo.find({
            day: {
                $or: [
                    {
                        date: {
                            $gte: scheduleStart.toDate(),
                            $lte: scheduleEnd.toDate()
                        }
                    },
                    {
                        day: {
                            $ne: null
                        }
                    }
                ]
            }
        }, {
            populate: true,
            disableIdentityMap: true
        });
        const allRuleItems = allRules.flatMap(item => {
            const date = item.day.day !== undefined
                ? scheduleStart.add(item.day.day, "days")
                : (0, dayjs_1.default)(item.day.date).utc();
            const start = (0, dayjs_1.default)(`${(0, dayjs_1.default)(date).format("YYYY-MM-DD")} ${item.day.start}`, "YYYY-MM-DD HH:mm");
            const end = (0, dayjs_1.default)(`${(0, dayjs_1.default)(date).format("YYYY-MM-DD")} ${item.day.end}`, "YYYY-MM-DD HH:mm");
            const rule = item.rules.getItems().map(inner => {
                return {
                    start,
                    end,
                    jobId: inner.jobTitle.id,
                    amount: inner.amount
                };
            });
            return rule;
        });
        const allEmps = (await this.personRepo.findAll({
            populate: [
                "jobTitle",
                "availabilities.day",
                "timeOffs.start",
                "timeOffs.end"
            ],
            disableIdentityMap: true
        })).reduce((acc, cur) => {
            acc[cur.id] = {
                ...cur,
                timeOffs: cur.timeOffs
                    .getItems()
                    .filter(x => x.isApproved)
                    .map(item => {
                    return {
                        id: item.id,
                        start: (0, dayjs_1.default)(`${(0, dayjs_1.default)(item.start.date)
                            .utc()
                            .format("YYYY-MM-DD")} ${item.start.start}`, "YYYY-MM-DD HH:mm"),
                        end: (0, dayjs_1.default)(`${(0, dayjs_1.default)(item.end.date)
                            .utc()
                            .format("YYYY-MM-DD")} ${item.end.start}`, "YYYY-MM-DD HH:mm")
                    };
                }),
                availabilities: cur.availabilities.getItems().map(item => {
                    const date = scheduleStart.add(item.day.day, "day");
                    return {
                        start: (0, dayjs_1.default)(`${(0, dayjs_1.default)(date)
                            .utc()
                            .format("YYYY-MM-DD")} ${item.day.start}`, "YYYY-MM-DD HH:mm"),
                        end: (0, dayjs_1.default)(`${(0, dayjs_1.default)(date)
                            .utc()
                            .format("YYYY-MM-DD")} ${item.day.end}`, "YYYY-MM-DD HH:mm")
                    };
                }),
                hoursWorkedPerWeek: 0
            };
            return acc;
        }, {});
        const workingEmpsPerDay = [...Array(7).keys()].reduce((acc, cur) => {
            acc[cur] = [];
            return acc;
        }, {});
        if (defaultSchedule) {
            const defaultScheduleItems = await this.scheduleItemRepo.find({ schedule: defaultSchedule }, ["day", "person"]);
            for (const item of defaultScheduleItems) {
                const timeOffs = allEmps[item.person.id].timeOffs;
                const weekday = (0, dayjs_1.default)(item.day.date)
                    .utc()
                    .day();
                const shiftDate = scheduleStart.add(weekday, "day");
                const duration = (0, dayjs_1.default)(item.day.end, "HH:mm").diff((0, dayjs_1.default)(item.day.start, "HH:mm"), "hour", true);
                const shiftStart = (0, dayjs_1.default)(`${shiftDate.format("YYYY-MM-DD")} ${item.day.start}`, "YYYY-MM-DD HH:mm");
                const shiftEnd = (0, dayjs_1.default)(`${shiftDate.format("YYYY-MM-DD")} ${item.day.end}`, "YYYY-MM-DD HH:mm");
                const hasTimeOff = checkTimeOff(timeOffs, shiftStart, shiftEnd);
                if (!hasTimeOff) {
                    const shiftDayItem = new DayItem_1.default({
                        start: item.day.start,
                        end: item.day.end,
                        date: shiftDate.toDate()
                    });
                    const scheduleItem = new ScheduleItem_1.default({
                        day: shiftDayItem,
                        person: item.person,
                        schedule
                    });
                    allEmps[item.person.id].hoursWorkedPerWeek += duration;
                    workingEmpsPerDay[weekday].push(item.person.id);
                    const ruleIndex = allRuleItems.findIndex(x => x.start.isSame(shiftStart) && x.end.isSame(shiftEnd));
                    if (ruleIndex >= 0) {
                        allRuleItems[ruleIndex].amount--;
                    }
                    this.scheduleItemRepo.persist(scheduleItem);
                }
            }
        }
        for (const ruleItem of allRuleItems) {
            const shiftDuration = ruleItem.end.diff(ruleItem.start, "hour", true);
            const dayOfWeek = ruleItem.start.day();
            const validEmps = Object.keys(allEmps).filter(personID => {
                const person = allEmps[personID];
                const timeoff = checkTimeOff(person.timeOffs, ruleItem.start, ruleItem.end);
                if (timeoff)
                    return false;
                const hasAvailability = person.availabilities.some(x => x.start.isSameOrBefore(ruleItem.start) &&
                    x.end.isSameOrAfter(ruleItem.end));
                const hasNeededJob = ruleItem.jobId === person.jobTitle.id;
                const empIsNotWorking = !workingEmpsPerDay[dayOfWeek].includes(personID);
                const doesNotExceedTotalHours = allEmps[personID].hoursWorkedPerWeek + shiftDuration <=
                    person.maxWeeklyHours;
                return (hasAvailability &&
                    empIsNotWorking &&
                    hasNeededJob &&
                    doesNotExceedTotalHours);
            });
            const scores = validEmps.reduce((acc, cur) => {
                acc[cur] = 0;
                return acc;
            }, {});
            Object.keys(scores).forEach(personId => {
                const person = allEmps[personId];
                if (person.role === "FT" && shiftDuration >= 8) {
                    scores[personId] += 10;
                }
                else if (person.role === "PT" && shiftDuration < 8) {
                    scores[personId] += 10;
                }
            });
            for (let _ = 0; _ < ruleItem.amount; _++) {
                if (Object.keys(scores).length === 0) {
                    break;
                }
                const maxScore = Object.keys(scores)
                    .map(x => scores[x])
                    .reduce((acc, cur) => (cur > acc ? cur : acc), 0);
                const bestEmpIds = Object.keys(scores).filter(x => scores[x] === maxScore);
                const randomIndex = Math.floor(Math.random() * bestEmpIds.length);
                const chosenEmpId = bestEmpIds[randomIndex];
                delete scores[chosenEmpId];
                workingEmpsPerDay[dayOfWeek].push(chosenEmpId);
                allEmps[chosenEmpId].hoursWorkedPerWeek += shiftDuration;
                const scheduleItem = new ScheduleItem_1.default({
                    day: new DayItem_1.default({
                        date: ruleItem.start.format("YYYY-MM-DD"),
                        start: ruleItem.start.format("HH:mm"),
                        end: ruleItem.end.format("HH:mm")
                    }),
                    schedule,
                    person: chosenEmpId
                });
                this.scheduleItemRepo.persist(scheduleItem);
            }
        }
        await this.repo.flush();
    }
};
Scheduler = Scheduler_1 = __decorate([
    (0, inversify_binding_decorators_1.provide)(Scheduler_1),
    __param(0, (0, decorators_1.InjectRepo)(Schedule_1.default)),
    __param(1, (0, decorators_1.InjectRepo)(ScheduleRule_1.default)),
    __param(2, (0, decorators_1.InjectRepo)(Person_1.Person)),
    __param(3, (0, decorators_1.InjectRepo)(ScheduleItem_1.default)),
    __metadata("design:paramtypes", [core_1.EntityRepository,
        core_1.EntityRepository,
        core_1.EntityRepository,
        core_1.EntityRepository])
], Scheduler);
exports.default = Scheduler;
//# sourceMappingURL=scheduler.js.map