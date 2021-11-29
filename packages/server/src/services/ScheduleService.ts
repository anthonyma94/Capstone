import { EntityRepository } from "@mikro-orm/core/entity/EntityRepository";
import dayjs, { Dayjs, tz } from "dayjs";
import customParseFormat from "dayjs";
import { provide } from "inversify-binding-decorators";
import Schedule from "../entities/Schedule";
import ScheduleRule from "../entities/ScheduleRule";
import { InjectRepo } from "../utils/decorators";
import { BaseService } from "./BaseService";
import DayItem from "../entities/DayItem";
import { Person } from "../entities/Person";
import ScheduleItem from "../entities/ScheduleItem";
import { FilterQuery } from "@mikro-orm/core";
import TimeOff from "../entities/TimeOff";
import { inject } from "inversify";
import Scheduler from "../utils/scheduler";

@provide(ScheduleService)
export default class ScheduleService extends BaseService<Schedule> {
    constructor(
        @InjectRepo(Schedule) repo: any,
        @InjectRepo(ScheduleRule)
        private scheduleRuleRepo: EntityRepository<ScheduleRule>,
        @InjectRepo(ScheduleItem)
        private scheduleItemRepo: EntityRepository<ScheduleItem>,
        @InjectRepo(Person)
        private personRepo: EntityRepository<Person>,
        @InjectRepo(TimeOff)
        private timeoffRepo: EntityRepository<TimeOff>,
        @inject(Scheduler)
        private scheduler: Scheduler
    ) {
        super(repo);
        dayjs.extend(customParseFormat);
    }

    private scheduleItemToEvent = async (item: ScheduleItem) => {
        if (!item.person.jobTitle || !item.person.jobTitle.name) {
            item.person.jobTitle = (
                await this.personRepo.findOneOrFail({ id: item.person.id }, [
                    "jobTitle"
                ])
            ).jobTitle;
        }
        const res = {
            id: item.id,
            start: dayjs(
                `${dayjs(item.day.date)
                    .utc()
                    .format("YYYY-MM-DD")} ${item.day.start}`,
                "YYYY-MM-DD HH:mm"
            )
                .utc()
                // .tz("America/Toronto", false)
                .toDate(),
            end: dayjs(
                `${dayjs(item.day.date)
                    .utc()
                    .format("YYYY-MM-DD")} ${item.day.end}`,
                "YYYY-MM-DD HH:mm"
            )
                .utc()
                .toDate(),
            title: `${item.day.start}-${item.day.end}`,
            resourceId: item.person.id,
            extendedProps: {
                job: item.person.jobTitle.name,
                name: item.person.firstName + " " + item.person.lastName,
                schedule: item.schedule.id
            }
        };
        return res;
    };

    public getRules = async () => {
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

    public addScheduleItem = async (params: {
        id: string;
        date: Dayjs;
        start: string;
        end: string;
        personId: string;
        scheduleId: string;
    }) => {
        const schedule = await this.repo.findOne({ id: params.scheduleId });

        if (!schedule) {
            const weekStart = params.date.subtract(params.date.day(), "day");
            const weekEnd = weekStart.add(6, "day");
            const newSchedule = new Schedule({
                isDefault: false,
                start: new DayItem({
                    date: weekStart.toDate(),
                    start: "00:00",
                    end: "00:00"
                }),
                end: new DayItem({
                    date: weekEnd.toDate(),
                    start: "00:00",
                    end: "00:00"
                })
            });
            this.repo.persist(newSchedule);
            params.scheduleId = newSchedule.id;
        }
        const day = new DayItem({
            start: params.start,
            end: params.end,
            date: params.date.toDate()
        });
        const item = new ScheduleItem({
            day,
            schedule: params.scheduleId,
            person: params.personId
        } as any);

        await this.scheduleItemRepo.persistAndFlush(item);

        return this.scheduleItemToEvent(item);
    };

    public getSchedule = async (start: Dayjs, user: string) => {
        const where: FilterQuery<Schedule> = {
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

        const response = [] as any[];

        for (const item of scheduleResp.scheduleItems) {
            response.push({
                id: item.id,
                start: dayjs(
                    `${dayjs(item.day.date)
                        .utc()
                        .format("YYYY-MM-DD")} ${item.day.start}`,
                    "YYYY-MM-DD HH:mm"
                )
                    .utc()
                    .toDate(),
                end: dayjs(
                    `${dayjs(item.day.date)
                        .utc()
                        .format("YYYY-MM-DD")} ${item.day.end}`,
                    "YYYY-MM-DD HH:mm"
                )
                    .utc()
                    .toDate(),
                title: `${item.day.start}-${item.day.end}`,
                resourceId: item.person.id,
                extendedProps: {
                    job: item.person.jobTitle.name,
                    name: item.person.firstName + " " + item.person.lastName,
                    schedule: scheduleResp.id
                }
            });
        }

        return { data: response, default: scheduleResp.isDefault };
    };

    public editScheduleItem = async (params: {
        id: string;
        date: Date;
        start: string;
        end: string;
        personId?: string;
    }) => {
        const item = await this.scheduleItemRepo.findOneOrFail(
            {
                id: params.id
            },
            ["day"]
        );

        item.day.date = params.date;
        item.day.start = params.start;
        item.day.end = params.end;

        if (params.personId) {
            item.person = params.personId as any;
        }

        await this.scheduleItemRepo.flush();
    };

    public deleteScheduleItem = async (id: string) => {
        const item = await this.scheduleItemRepo.findOneOrFail({ id });
        await this.scheduleItemRepo.removeAndFlush(item);
    };

    public setDefaultSchedule = async (weekStart: Dayjs) => {
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

    public createSchedule = async (scheduleStart: Dayjs) => {
        await this.scheduler.createSchedule(scheduleStart);
    };

    // public createSchedule = async (scheduleStart: Dayjs) => {
    //     if (scheduleStart.day() !== 0) {
    //         throw new Error("Schedule must start on a Sunday.");
    //     }

    //     const defaultSchedule = await this.repo.findOne({ isDefault: true });
    //     const scheduleEnd = scheduleStart.add(7, "day").subtract(1, "minute");

    //     const schedule = new Schedule({
    //         isDefault: false,
    //         start: new DayItem({
    //             start: "00:00",
    //             end: "00:00",
    //             date: scheduleStart.toDate()
    //         }),
    //         end: new DayItem({
    //             start: "00:00",
    //             end: "00:00",
    //             date: scheduleEnd.toDate()
    //         })
    //     });

    //     this.repo.persist(schedule);

    //     const allRules = await this.scheduleRuleRepo.findAll({
    //         populate: { day: true, rules: { jobTitle: true } },
    //         disableIdentityMap: true
    //     });
    //     const allEmps = await this.personRepo.findAll({
    //         populate: { jobTitle: true, availabilities: { day: true } }
    //     });

    //     // Group rules into days (TODO: add specific date rules to here)
    //     const ruleMapByDay = allRules.reduce((acc, cur) => {
    //         // Rule is general purpose (every week)
    //         if (cur.day.day !== undefined) {
    //             const day = cur.day.day;
    //             if (!acc.has(day)) {
    //                 acc.set(day, [cur]);
    //             } else {
    //                 const array = acc.get(day)!;
    //                 array.push(cur);
    //                 acc.set(day, array);
    //             }
    //         }
    //         return acc;
    //     }, new Map<number, ScheduleRule[]>());

    //     // Sets everyone's hours worked to 0. This should reset per week
    //     const hoursWorked = allEmps.reduce((acc, cur) => {
    //         acc.set(cur, 0);
    //         return acc;
    //     }, new Map<Person, number>());

    //     const timeoffs = (
    //         await this.timeoffRepo.find(
    //             {
    //                 isApproved: true
    //             },
    //             ["start", "end", "person"]
    //         )
    //     )
    //         .map(item => {
    //             return {
    //                 person: item.person,
    //                 start: dayjs(
    //                     `${dayjs(item.start.date)
    //                         .utc()
    //                         .format("YYYY-MM-DD")} ${item.start.start}`,
    //                     "YYYY-MM-DD HH:mm"
    //                 ),
    //                 end: dayjs(
    //                     `${dayjs(item.end.date)
    //                         .utc()
    //                         .format("YYYY-MM-DD")} ${item.end.start}`,
    //                     "YYYY-MM-DD HH:mm"
    //                 )
    //             };
    //         })
    //         .filter(
    //             item =>
    //                 item.start.isBetween(
    //                     scheduleStart,
    //                     scheduleEnd,
    //                     "millisecond",
    //                     "[]"
    //                 ) ||
    //                 item.end.isBetween(
    //                     scheduleStart,
    //                     scheduleEnd,
    //                     "millisecond",
    //                     "[]"
    //                 ) ||
    //                 (item.start.isSameOrBefore(scheduleStart) &&
    //                     item.end.isSameOrAfter(scheduleEnd))
    //         );

    //     // Check and set approved time offs
    //     const empTimeOffs: Person[][] = [];

    //     for (let i = 0; i < 7; i++) {
    //         const dayToCheck = scheduleStart.add(i, "day");
    //         const people = timeoffs
    //             .filter(x => dayToCheck.isBetween(x.start, x.end, "day", "[]"))
    //             .map(x => x.person);
    //         empTimeOffs.push(people);
    //     }

    //     const empIsWorking = Array.from({ length: 7 }, () =>
    //         allEmps.reduce((acc, cur) => {
    //             acc.set(cur, false);
    //             return acc;
    //         }, new Map<Person, boolean>())
    //     );

    //     // Sets default schedule first
    //     if (defaultSchedule) {
    //         const defaultScheduleItems = await this.scheduleItemRepo.find(
    //             { schedule: defaultSchedule },
    //             ["day", "person"]
    //         );

    //         // Adds defaults shifts to schedule first
    //         for (const item of defaultScheduleItems) {
    //             const weekday = dayjs(item.day.date)
    //                 .utc()
    //                 .day();

    //             if (!empTimeOffs[weekday].includes(item.person)) {
    //                 const date = scheduleStart.add(weekday, "day");
    //                 const duration = dayjs(item.day.end, "HH:mm").diff(
    //                     dayjs(item.day.start, "HH:mm"),
    //                     "hour"
    //                 );

    //                 const newDay = new DayItem({
    //                     start: item.day.start,
    //                     end: item.day.end,
    //                     date: date.toDate()
    //                 });
    //                 const newItem = new ScheduleItem({
    //                     day: newDay,
    //                     person: item.person,
    //                     schedule
    //                 });

    //                 hoursWorked.set(
    //                     item.person,
    //                     hoursWorked.get(item.person)! + duration
    //                 );

    //                 // Marks person as working for the day
    //                 empIsWorking[weekday].set(item.person, true);

    //                 // Remove the specific schedule rule from the map
    //                 // so it doesn't get executed later
    //                 const ruleByDay = ruleMapByDay.get(weekday);

    //                 if (ruleByDay && ruleByDay.length > 0) {
    //                     const ruleByTime = ruleByDay.find(
    //                         x =>
    //                             x.day.start === item.day.start &&
    //                             x.day.end === item.day.end
    //                     );

    //                     if (ruleByTime) {
    //                         const rules = ruleByTime.rules
    //                             .getItems()
    //                             .find(
    //                                 x =>
    //                                     x.jobTitle.id ===
    //                                     item.person.jobTitle.id
    //                             );

    //                         if (rules) {
    //                             rules.amount--;
    //                         }
    //                     }
    //                 }

    //                 this.scheduleItemRepo.persist(newItem);
    //             }
    //         }
    //     }

    //     // Group each role's shift together for the day based on scheduling rule => number of shifts
    //     // Employee must still be under max working hours
    //     // Employee must only work 1 shift per day
    //     // FT employees must be used first for long shifts (> 6 hours)

    //     // Integer constraints:
    //     // Number of employees per shift in each role
    //     // Assign priority values to each employee, higher priority gets picked first

    //     // rulePerDay === Rule array per day
    //     for (const rulePerDay of ruleMapByDay.values()) {
    //         // rule === individual rule per day
    //         for (const rule of rulePerDay) {
    //             const end = dayjs(rule.day.end, "HH:mm");
    //             const start = dayjs(rule.day.start, "HH:mm");
    //             const totalHours = end.diff(start, "hour");

    //             // Only these employees can work
    //             const validEmps = allEmps.filter(person => {
    //                 // Check if employee has a time off first
    //                 const offs = timeoffs.filter(
    //                     x => x.person.id === person.id
    //                 );
    //                 if (offs.length > 0) {
    //                     for (const off of offs) {
    //                         // if start or end of shift is between time off period
    //                         if (
    //                             start.isBetween(
    //                                 off.start,
    //                                 off.end,
    //                                 "millisecond",
    //                                 "[]"
    //                             ) ||
    //                             end.isBetween(
    //                                 off.start,
    //                                 off.end,
    //                                 "millisecond",
    //                                 "[]"
    //                             )
    //                         ) {
    //                             return false;
    //                         }
    //                     }
    //                 }

    //                 // Available if:
    //                 // availability matches &&
    //                 // employee isn't working that day &&
    //                 // hours added would not excced their weekly hours
    //                 const isAvailable =
    //                     person.availabilities.getItems().some(x => {
    //                         const aStart = dayjs(x.day.start, "HH:mm");
    //                         const aEnd = dayjs(x.day.end, "HH:mm");
    //                         return (
    //                             start.isBetween(
    //                                 aStart,
    //                                 aEnd,
    //                                 "millisecond",
    //                                 "[]"
    //                             ) &&
    //                             end.isBetween(
    //                                 aStart,
    //                                 aEnd,
    //                                 "millisecond",
    //                                 "[]"
    //                             ) &&
    //                             x.day.day === rule.day.day
    //                         );
    //                     }) &&
    //                     !empIsWorking[rule.day.day!].get(person) &&
    //                     hoursWorked.get(person)! + totalHours <
    //                         person.maxWeeklyHours;
    //                 return isAvailable;
    //             });

    //             // Sets everyone's score to 0. This resets for each rule
    //             const scores = validEmps.reduce((acc, cur) => {
    //                 acc.set(cur, 0);
    //                 return acc;
    //             }, new Map<Person, number>());

    //             // Calculate scores (does not account for job title)
    //             for (const person of scores.keys()) {
    //                 if (person.role === "FT" && totalHours >= 8) {
    //                     scores.set(person, scores.get(person)! + 10);
    //                 } else if (person.role === "PT" && totalHours < 8) {
    //                     scores.set(person, scores.get(person)! + 10);
    //                 }
    //             }

    //             // Get amount of employees needed per job title
    //             const numEmpsNeededPerTitle = rule.rules
    //                 .getItems()
    //                 .reduce((acc, cur) => {
    //                     if (!acc[cur.jobTitle.name]) {
    //                         acc[cur.jobTitle.name] = cur.amount;
    //                     } else {
    //                         acc[cur.jobTitle.name] += cur.amount;
    //                     }
    //                     return acc;
    //                 }, {} as { [id: string]: number });

    //             for (const key of Object.keys(numEmpsNeededPerTitle)) {
    //                 const numEmpsNeeded = numEmpsNeededPerTitle[key];
    //                 const workingEmps: Array<Person> = [];
    //                 let missingEmps = 0;

    //                 // Sorts and filters employees based on their job title and highest scores
    //                 let validEmpsInner = Array.from(scores.entries())
    //                     .filter(x => x[0].jobTitle.name === key)
    //                     .sort((a, b) => b[1] - a[1]);

    //                 for (let i = 0; i < numEmpsNeeded; i++) {
    //                     if (validEmpsInner.length > i) {
    //                         const maxScore = validEmpsInner.reduce(
    //                             (acc, cur) => (cur[1] > acc ? cur[1] : acc),
    //                             0
    //                         );
    //                         const maxEmps = validEmpsInner
    //                             .filter(x => x[1] === maxScore)
    //                             .map(x => x[0]);
    //                         const randIndex = Math.floor(
    //                             Math.random() * maxEmps.length
    //                         );
    //                         const person = maxEmps[randIndex];
    //                         validEmpsInner = validEmpsInner.filter(
    //                             x => x[0].id !== person.id
    //                         );
    //                         workingEmps.push(person);
    //                         hoursWorked.set(
    //                             person,
    //                             hoursWorked.get(person)! + totalHours
    //                         );
    //                         empIsWorking[rule.day.day!].set(person, true);
    //                     } else {
    //                         missingEmps++;
    //                     }
    //                 }

    //                 if (workingEmps.length > 0) {
    //                     for (const i of workingEmps) {
    //                         const scheduleItemDay = new DayItem({
    //                             start: rule.day.start,
    //                             end: rule.day.end,
    //                             date: scheduleStart
    //                                 .add(rule.day.day!, "day")
    //                                 .toDate()
    //                         });

    //                         const scheduleLineItem = new ScheduleItem({
    //                             day: scheduleItemDay,
    //                             schedule,
    //                             person: i
    //                         });

    //                         this.scheduleItemRepo.persist(scheduleLineItem);
    //                         // const personScheduleItem = new PersonScheduleItem({
    //                         //     person: i,
    //                         //     item: scheduleLineItem
    //                         // });
    //                         // this.personScheduleItemRepo.persist(
    //                         //     personScheduleItem
    //                         // );
    //                     }
    //                     // console.log(`\n${key} employees working:`);
    //                     // workingEmps.forEach(x => {
    //                     //     console.log(x.firstName + " " + x.lastName);
    //                     // });
    //                 }
    //                 if (missingEmps) {
    //                     console.log(
    //                         `Could not find ${missingEmps} suitable employee(s) working ${key} for this shift.`
    //                     );
    //                 }
    //             }
    //         }
    //     }

    //     this.repo.flush();
    // };
}
