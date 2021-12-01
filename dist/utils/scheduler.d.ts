import { EntityRepository } from "@mikro-orm/core";
import { Dayjs } from "dayjs";
import { Person } from "../entities/Person";
import Schedule from "../entities/Schedule";
import ScheduleItem from "../entities/ScheduleItem";
import ScheduleRule from "../entities/ScheduleRule";
export default class Scheduler {
    private repo;
    private scheduleRuleRepo;
    private personRepo;
    private scheduleItemRepo;
    constructor(repo: EntityRepository<Schedule>, scheduleRuleRepo: EntityRepository<ScheduleRule>, personRepo: EntityRepository<Person>, scheduleItemRepo: EntityRepository<ScheduleItem>);
    createSchedule(scheduleStart: Dayjs): Promise<void>;
}
