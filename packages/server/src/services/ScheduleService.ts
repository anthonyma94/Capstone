/**
 * This uses a combination of ASP.NET and NodeJS patterns (refer to BaseService).
 */

import { EntityRepository } from "@mikro-orm/core/entity/EntityRepository";
import dayjs, { Dayjs } from "dayjs";
import { provide } from "inversify-binding-decorators";
import Schedule from "../entities/Schedule";
import ScheduleRule from "../entities/ScheduleRule";
import { InjectRepo } from "../utils/decorators";
import { BaseService } from "./BaseService";
import DayItem from "../entities/DayItem";
import { Person } from "../entities/Person";
import ScheduleItem from "../entities/ScheduleItem";
import { FilterQuery } from "@mikro-orm/core";
import { inject } from "inversify";
import Scheduler from "../utils/scheduler";
import ScheduleRuleItem from "../entities/ScheduleRuleItem";

@provide(ScheduleService)
export default class ScheduleService extends BaseService<Schedule> {
    constructor(
        @InjectRepo(Schedule) repo: any,
        @InjectRepo(ScheduleRule)
        private scheduleRuleRepo: EntityRepository<ScheduleRule>,
        @InjectRepo(ScheduleRuleItem)
        private scheduleRuleItemRepo: EntityRepository<ScheduleRuleItem>,
        @InjectRepo(ScheduleItem)
        private scheduleItemRepo: EntityRepository<ScheduleItem>,
        @InjectRepo(Person)
        private personRepo: EntityRepository<Person>,
        @inject(Scheduler)
        private scheduler: Scheduler
    ) {
        super(repo);
    }

    /**
     * Converts a schedule item to a FullCalendar event object.
     * @param item Schedule Item
     * @returns FullCalendar event
     */
    private scheduleItemToEvent = async (item: ScheduleItem) => {
        if (!item.person.jobTitle || !item.person.jobTitle.name) {
            item.person.jobTitle = (
                await this.personRepo.findOneOrFail({ id: item.person.id }, [
                    "jobTitle"
                ])
            ).jobTitle;
        }
        const start = dayjs(
            `${dayjs(item.day.date)
                .utc()
                .format("YYYY-MM-DD")} ${item.day.start}`,
            "YYYY-MM-DD HH:mm"
        );
        const end = dayjs(
            `${dayjs(item.day.date)
                .utc()
                .format("YYYY-MM-DD")} ${item.day.end}`,
            "YYYY-MM-DD HH:mm"
        );
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

        return await this.scheduleItemToEvent(item);
    };

    /**
     * Gets schedule. Checks only for the given week for lazy loading.
     * @param start The sunday to check
     * @param user Find for a specific user
     * @returns Schedule
     */
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
            response.push(await this.scheduleItemToEvent(item));
            // response.push({
            //     id: item.id,
            //     start: dayjs(
            //         `${dayjs(item.day.date)
            //             .utc()
            //             .format("YYYY-MM-DD")} ${item.day.start}`,
            //         "YYYY-MM-DD HH:mm"
            //     )
            //         .utc()
            //         .toDate(),
            //     end: dayjs(
            //         `${dayjs(item.day.date)
            //             .utc()
            //             .format("YYYY-MM-DD")} ${item.day.end}`,
            //         "YYYY-MM-DD HH:mm"
            //     )
            //         .utc()
            //         .toDate(),
            //     title: `${item.day.start}-${item.day.end}`,
            //     resourceId: item.person.id,
            //     extendedProps: {
            //         job: item.person.jobTitle.name,
            //         name: item.person.firstName + " " + item.person.lastName,
            //         schedule: scheduleResp.id
            //     }
            // });
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

    public addOrEditScheduleRule = async (params: {
        id?: string;
        days: number[];
        date?: Dayjs;
        start: Dayjs;
        end: Dayjs;
        employees: { jobId: string; amount: number; id?: string }[];
    }) => {
        if (!params.id) {
            const scheduleRules = [] as ScheduleRule[];
            const ruleItems = [] as ScheduleRuleItem[];
            const dayItems = [] as DayItem[];
            if (params.days.length > 0) {
                for (const day of params.days) {
                    const dayItem = new DayItem({
                        start: params.start.format("HH:mm"),
                        end: params.end.format("HH:mm"),
                        day
                    });
                    dayItems.push(dayItem);
                }
            } else if (params.date) {
                const dayItem = new DayItem({
                    start: params.start.format("HH:mm"),
                    end: params.end.format("HH:mm"),
                    date: params.date.toDate()
                });
                dayItems.push(dayItem);
            } else throw new Error("Missing weekdays and date");

            for (const dayItem of dayItems) {
                const scheduleRule = new ScheduleRule({ day: dayItem });
                scheduleRules.push(scheduleRule);
            }

            for (const scheduleRule of scheduleRules) {
                for (const emp of params.employees) {
                    const ruleItem = new ScheduleRuleItem({
                        scheduleRule,
                        jobTitle: emp.jobId,
                        amount: emp.amount
                    } as any);
                    ruleItems.push(ruleItem);
                    scheduleRule.rules.add(ruleItem);
                }
            }

            await this.scheduleRuleItemRepo.persistAndFlush(ruleItems);
            await this.scheduleRuleRepo.persistAndFlush(scheduleRules);

            const res = await this.scheduleRuleRepo.find(
                {
                    $or: scheduleRules.map(item => {
                        return {
                            id: item.id
                        };
                    })
                },
                {
                    populate: ["rules.jobTitle", "day"]
                }
            );
            return res;
        } else {
            const scheduleRules = [] as ScheduleRule[];
            const rule = await this.scheduleRuleRepo.findOneOrFail(
                { id: params.id },
                ["day", "rules.jobTitle"]
            );
            scheduleRules.push(rule);

            // Day may be potentially changed, but nothing added or removed
            if (params.days.length === 1) {
                rule.day.day = params.days[0];
            }
            // More days were added
            else if (params.days.length > 1) {
                params.days = params.days.filter(x => x !== rule.day.day);
                for (const day of params.days) {
                    const newRule = new ScheduleRule({
                        day: new DayItem({
                            start: params.start.format("HH:mm"),
                            end: params.end.format("HH:mm"),
                            day
                        })
                    });
                    this.scheduleRuleRepo.persist(newRule);
                    scheduleRules.push(newRule);
                    for (const emp of params.employees) {
                        const item = new ScheduleRuleItem({
                            scheduleRule: newRule,
                            jobTitle: emp.jobId as any,
                            amount: emp.amount
                        });
                        this.scheduleRuleItemRepo.persist(item);
                    }
                }
                await this.scheduleRuleRepo.flush();
                await this.scheduleRuleItemRepo.flush();
            }

            // Date may be changed
            if (params.date) {
                rule.day.date = params.date.toDate();
            }

            for (const emp of params.employees) {
                if (emp.id) {
                    const item = await this.scheduleRuleItemRepo.findOneOrFail({
                        id: emp.id
                    });
                    item.jobTitle = emp.jobId as any;
                    item.amount = emp.amount;
                }
            }

            await this.scheduleRuleRepo.flush();
            await this.scheduleRuleItemRepo.flush();

            const res = await this.scheduleRuleRepo.find(
                {
                    $or: scheduleRules.map(item => {
                        return {
                            id: item.id
                        };
                    })
                },
                {
                    populate: ["rules.jobTitle", "day"]
                }
            );
            return res;
        }
    };

    public deleteScheduleRule = async (id: string) => {
        const item = await this.scheduleRuleRepo.findOneOrFail({ id }, [
            "rules",
            "day"
        ]);
        await this.scheduleRuleRepo.removeAndFlush(item);
    };

    public getScheduleStartDates = async () => {
        const items = await this.repo.findAll({ populate: ["start"] });

        const res = items.map(item => item.start.date);
        return res;
    };
}
