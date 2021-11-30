import { EntityRepository } from "@mikro-orm/core";
import dayjs, { Dayjs } from "dayjs";
import { provide } from "inversify-binding-decorators";
import DayItem from "../entities/DayItem";
import { Person } from "../entities/Person";
import Schedule from "../entities/Schedule";
import ScheduleItem from "../entities/ScheduleItem";
import ScheduleRule from "../entities/ScheduleRule";
import { InjectRepo } from "./decorators";

@provide(Scheduler)
export default class Scheduler {
    constructor(
        @InjectRepo(Schedule) private repo: EntityRepository<Schedule>,
        @InjectRepo(ScheduleRule)
        private scheduleRuleRepo: EntityRepository<ScheduleRule>,
        @InjectRepo(Person) private personRepo: EntityRepository<Person>,
        @InjectRepo(ScheduleItem)
        private scheduleItemRepo: EntityRepository<ScheduleItem>
    ) {}

    public async createSchedule(scheduleStart: Dayjs) {
        function checkTimeOff(
            timeoffs: Array<{ id: string; start: Dayjs; end: Dayjs }>,
            start: Dayjs,
            end: Dayjs
        ) {
            // Checks each timeoff for the employee, checks if any happen during the shift, don't run if so
            let result = false;
            if (timeoffs.length > 0) {
                for (const timeOff of timeoffs) {
                    // Logic: if vacay end < shift start || vacay start > shift end
                    // vacay period isn't within shift.
                    result = !(
                        timeOff.end.isBefore(start) ||
                        timeOff.start.isAfter(end)
                    );
                    if (result) break;
                }
            }
            return result;
        }
        if (scheduleStart.day() !== 0) {
            throw new Error("Schedule must start on a Sunday.");
        }

        const defaultSchedule = await this.repo.findOne({ isDefault: true });

        const scheduleEnd = scheduleStart.add(7, "day").subtract(1, "minute");

        const schedule = new Schedule({
            isDefault: false,
            start: new DayItem({
                start: "00:00",
                end: "00:00",
                date: scheduleStart.toDate()
            }),
            end: new DayItem({
                start: "00:00",
                end: "00:00",
                date: scheduleEnd.toDate()
            })
        });

        this.repo.persist(schedule);

        const allRules = await this.scheduleRuleRepo.findAll({
            populate: true,
            disableIdentityMap: true
        });

        // Map rule items into 1D array (TODO: add specific date rules to here)
        const allRuleItems = allRules.flatMap(item => {
            const date = scheduleStart.add(item.day.day!, "days");
            const start = dayjs(
                `${dayjs(date).format("YYYY-MM-DD")} ${item.day.start}`,
                "YYYY-MM-DD HH:mm"
            );
            const end = dayjs(
                `${dayjs(date).format("YYYY-MM-DD")} ${item.day.end}`,
                "YYYY-MM-DD HH:mm"
            );
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

        type EmpTempType = Omit<
            Person,
            "availabilities" | "timeOffs" | "scheduleItems"
        > & {
            availabilities: Array<{ start: Dayjs; end: Dayjs }>;
            timeOffs: Array<{ id: string; start: Dayjs; end: Dayjs }>;
            hoursWorkedPerWeek: number;
        };

        const allEmps = (
            await this.personRepo.findAll({
                populate: [
                    "jobTitle",
                    "availabilities.day",
                    "timeOffs.start",
                    "timeOffs.end"
                ],
                disableIdentityMap: true
            })
        ).reduce((acc, cur) => {
            acc[cur.id] = {
                ...cur,
                timeOffs: cur.timeOffs
                    .getItems()
                    .filter(x => x.isApproved)
                    .map(item => {
                        return {
                            id: item.id,
                            start: dayjs(
                                `${dayjs(item.start.date)
                                    .utc()
                                    .format("YYYY-MM-DD")} ${item.start.start}`,
                                "YYYY-MM-DD HH:mm"
                            ),
                            end: dayjs(
                                `${dayjs(item.end.date)
                                    .utc()
                                    .format("YYYY-MM-DD")} ${item.end.start}`,
                                "YYYY-MM-DD HH:mm"
                            )
                        };
                    }),
                availabilities: cur.availabilities.getItems().map(item => {
                    const date = scheduleStart.add(item.day.day!, "day");
                    return {
                        start: dayjs(
                            `${dayjs(date)
                                .utc()
                                .format("YYYY-MM-DD")} ${item.day.start}`,
                            "YYYY-MM-DD HH:mm"
                        ),
                        end: dayjs(
                            `${dayjs(date)
                                .utc()
                                .format("YYYY-MM-DD")} ${item.day.end}`,
                            "YYYY-MM-DD HH:mm"
                        )
                    };
                }),
                hoursWorkedPerWeek: 0
            };
            return acc;
        }, {} as { [id: string]: EmpTempType });

        // Employees are tracked by ID
        const workingEmpsPerDay = [...Array(7).keys()].reduce((acc, cur) => {
            acc[cur] = [];
            return acc;
        }, {} as { [weekday: number]: string[] });

        // Sets default schedule first
        if (defaultSchedule) {
            const defaultScheduleItems = await this.scheduleItemRepo.find(
                { schedule: defaultSchedule },
                ["day", "person"]
            );

            // Adds default shifts to schedule first
            for (const item of defaultScheduleItems) {
                // Variables
                const timeOffs = allEmps[item.person.id].timeOffs;
                const weekday = dayjs(item.day.date)
                    .utc()
                    .day();
                const shiftDate = scheduleStart.add(weekday, "day");
                const duration = dayjs(item.day.end, "HH:mm").diff(
                    dayjs(item.day.start, "HH:mm"),
                    "hour"
                );
                const shiftStart = dayjs(
                    `${shiftDate.format("YYYY-MM-DD")} ${item.day.start}`,
                    "YYYY-MM-DD HH:mm"
                );
                const shiftEnd = dayjs(
                    `${shiftDate.format("YYYY-MM-DD")} ${item.day.end}`,
                    "YYYY-MM-DD HH:mm"
                );

                const hasTimeOff = checkTimeOff(timeOffs, shiftStart, shiftEnd);

                if (!hasTimeOff) {
                    const shiftDayItem = new DayItem({
                        start: item.day.start,
                        end: item.day.end,
                        date: shiftDate.toDate()
                    });
                    const scheduleItem = new ScheduleItem({
                        day: shiftDayItem,
                        person: item.person,
                        schedule
                    });

                    // Marks person as working for the day
                    allEmps[item.person.id].hoursWorkedPerWeek += duration;
                    workingEmpsPerDay[weekday].push(item.person.id);

                    // Remove the schedule rule from allRuleItems so it doesn't get executed later
                    const ruleIndex = allRuleItems.findIndex(
                        x =>
                            x.start.isSame(shiftStart) && x.end.isSame(shiftEnd)
                    );

                    if (ruleIndex >= 0) {
                        allRuleItems[ruleIndex].amount--;
                    }
                    this.scheduleItemRepo.persist(scheduleItem);
                }
            }
        }

        // Group each role's shift together for the day based on scheduling rule => number of shifts
        // Employee must still be under max working hours
        // Employee must only work 1 shift per day
        // FT employees must be used first for long shifts (> 6 hours)

        // Integer constraints:
        // Number of employees per shift in each role
        // Assign priority values to each employee, higher priority gets picked first

        // rulePerDay === Rule array per day

        for (const ruleItem of allRuleItems) {
            const shiftDuration = ruleItem.end.diff(ruleItem.start, "hour");
            const dayOfWeek = ruleItem.start.day();

            // Only these employees can work
            const validEmps = Object.keys(allEmps).filter(personID => {
                // Check for timeoff first
                const person = allEmps[personID];
                const timeoff = checkTimeOff(
                    person.timeOffs,
                    ruleItem.start,
                    ruleItem.end
                );

                if (timeoff) return false;

                // Available if:
                // employee has matching job title &&
                // availability matches &&
                // employee isn't working that day &&
                // hours added would not excced their weekly hours
                const hasAvailability = person.availabilities.some(
                    x =>
                        x.start.isSameOrBefore(ruleItem.start) &&
                        x.end.isSameOrAfter(ruleItem.end)
                );

                const hasNeededJob = ruleItem.jobId === person.jobTitle.id;

                const empIsNotWorking = !workingEmpsPerDay[dayOfWeek].includes(
                    personID
                );

                const doesNotExceedTotalHours =
                    allEmps[personID].hoursWorkedPerWeek + shiftDuration <=
                    person.maxWeeklyHours;

                return (
                    hasAvailability &&
                    empIsNotWorking &&
                    hasNeededJob &&
                    doesNotExceedTotalHours
                );
            });

            // Sets everyone's score to 0. This resets for each rule
            const scores = validEmps.reduce((acc, cur) => {
                acc[cur] = 0;
                return acc;
            }, {} as { [personId: string]: number });

            // Calculate scores
            // If person is FT and shift is 8 hours or more, score +10
            // If person is PT and shift is less than 8 hours, score +10
            Object.keys(scores).forEach(personId => {
                const person = allEmps[personId];
                if (person.role === "FT" && shiftDuration >= 8) {
                    scores[personId] += 10;
                } else if (person.role === "PT" && shiftDuration < 8) {
                    scores[personId] += 10;
                }
            });

            for (let _ = 0; _ < ruleItem.amount; _++) {
                // Stop creating new items if there are no more suitable employees
                if (Object.keys(scores).length === 0) {
                    break;
                }

                // Sorts and filters employees based on their scores
                const maxScore = Object.keys(scores)
                    .map(x => scores[x])
                    .reduce((acc, cur) => (cur > acc ? cur : acc), 0);

                const bestEmpIds = Object.keys(scores).filter(
                    x => scores[x] === maxScore
                );

                const randomIndex = Math.floor(
                    Math.random() * bestEmpIds.length
                );

                const chosenEmpId = bestEmpIds[randomIndex];

                // Sets various variables for next round
                delete scores[chosenEmpId];
                workingEmpsPerDay[dayOfWeek].push(chosenEmpId);
                allEmps[chosenEmpId].hoursWorkedPerWeek += shiftDuration;

                // Create new Schedule Item and repeat
                const scheduleItem = new ScheduleItem({
                    day: new DayItem({
                        date: ruleItem.start.format("YYYY-MM-DD"),
                        start: ruleItem.start.format("HH:mm"),
                        end: ruleItem.end.format("HH:mm")
                    } as any),
                    schedule,
                    person: chosenEmpId as any
                });

                this.scheduleItemRepo.persist(scheduleItem);
            }
        }

        await this.repo.flush();
    }
}
