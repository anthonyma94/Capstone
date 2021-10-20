import { EntityRepository } from "@mikro-orm/core";
import dayjs from "dayjs";
import { injectable } from "inversify";
import { provide } from "inversify-binding-decorators";
import { Person } from "../entities/Person";
import ScheduleRule from "../entities/ScheduleRule";
import { InjectRepo } from "./decorators";

@provide(Scheduler)
export default class Scheduler {
    constructor(
        @InjectRepo(ScheduleRule)
        private ruleRepo: EntityRepository<ScheduleRule>,
        @InjectRepo(Person) private personRepo: EntityRepository<Person>
    ) {}

    public async schedule() {
        // const res = await this.repo.findOneOrFail(id, {
        //     populate: { jobTitle: true, availabilities: { day: true } },
        //     ...options
        // });

        const allRules = await this.ruleRepo.findAll({
            populate: { day: true, rules: { jobTitle: true } }
        });
        const allEmps = await this.personRepo.findAll({
            populate: { jobTitle: true, availabilities: { day: true } }
        });

        // Group rules into days (TODO: add specific date rules to here)
        const ruleMapByDay = allRules.reduce((acc, cur) => {
            // Rule is general purpose (every week)
            if (cur.day.day !== undefined) {
                const day = cur.day.day;
                if (!acc.has(day)) {
                    acc.set(day, [cur]);
                } else {
                    const array = acc.get(day)!;
                    array.push(cur);
                    acc.set(day, array);
                }
            }
            return acc;
        }, new Map<number, ScheduleRule[]>());

        // Sets everyone's hours worked to 0. This should reset per week
        const hoursWorked = allEmps.reduce((acc, cur) => {
            acc.set(cur, 0);
            return acc;
        }, new Map<Person, number>());

        // Sets everyone's score to 0. This should reset per week
        const scores = allEmps.reduce((acc, cur) => {
            acc.set(cur, 0);
            return acc;
        }, new Map<Person, number>());

        // Group each role's shift together for the day based on scheduling rule => number of shifts
        // Employee must still be under max working hours
        // Employee must only work 1 shift per day
        // FT employees must be used first for long shifts (> 6 hours)

        // Integer constraints:
        // Number of employees per shift in each role
        // Assign priority values to each employee, higher priority gets picked first

        // rulePerDay === Rule array per day
        for (const rulePerDay of ruleMapByDay.values()) {
            const numOfShifts = rulePerDay.length;

            const numEmpsPerShift = rulePerDay.reduce((acc, cur) => {
                acc.push(
                    cur.rules.getItems().reduce((acc2, cur) => {
                        if (cur.jobTitle.name === "Sales") acc2 += cur.amount;
                        return acc2;
                    }, 0)
                );
                return acc;
            }, [] as number[]);

            // rule === individual rule per day
            for (const rule of rulePerDay) {
                const end = dayjs(rule.day.end);
                const start = dayjs(rule.day.start);
                const totalHours = dayjs(rule.day.end).diff(
                    dayjs(rule.day.start),
                    "hour"
                );

                // Calculate scores
                for (const person of scores.keys()) {
                    if (person.role === "FT") {
                        scores.set(person, scores.get(person)! + 10);
                    }
                }

                const numEmpsNeeded = rule.rules
                    .getItems()
                    .reduce((acc, cur) => {
                        if (cur.jobTitle.name === "Sales") acc += cur.amount;
                        return acc;
                    }, 0);

                const results = Array.from(scores.entries())
                    .sort((a, b) => a[1] - b[1])
                    .filter((_, idx) => idx < numEmpsNeeded);

                for (const person of allEmps) {
                    if (results.some(x => x[0] === person)) {
                        console.log(
                            `${person.firstName +
                                " " +
                                person.lastName} is working a shift.`
                        );
                    } else {
                        console.log(
                            `${person.firstName +
                                " " +
                                person.lastName} is not working.`
                        );
                    }
                }
            }
        }
    }
}
