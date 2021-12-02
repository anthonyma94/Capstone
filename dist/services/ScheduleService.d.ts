import { EntityRepository } from "@mikro-orm/core/entity/EntityRepository";
import { Dayjs } from "dayjs";
import Schedule from "../entities/Schedule";
import ScheduleRule from "../entities/ScheduleRule";
import { BaseService } from "./BaseService";
import { Person } from "../entities/Person";
import ScheduleItem from "../entities/ScheduleItem";
import Scheduler from "../utils/scheduler";
import ScheduleRuleItem from "../entities/ScheduleRuleItem";
export default class ScheduleService extends BaseService<Schedule> {
    private scheduleRuleRepo;
    private scheduleRuleItemRepo;
    private scheduleItemRepo;
    private personRepo;
    private scheduler;
    constructor(repo: any, scheduleRuleRepo: EntityRepository<ScheduleRule>, scheduleRuleItemRepo: EntityRepository<ScheduleRuleItem>, scheduleItemRepo: EntityRepository<ScheduleItem>, personRepo: EntityRepository<Person>, scheduler: Scheduler);
    private scheduleItemToEvent;
    getRules: () => Promise<(ScheduleRule & {
        rules: import("@mikro-orm/core").LoadedCollection<ScheduleRuleItem, ScheduleRuleItem & {}>;
    })[]>;
    addScheduleItem: (params: {
        id: string;
        date: Dayjs;
        start: string;
        end: string;
        personId: string;
        scheduleId: string;
    }) => Promise<{
        id: string;
        start: Date;
        end: Date;
        title: string;
        resourceId: string;
        extendedProps: {
            job: string;
            name: string;
            schedule: string;
        };
    }>;
    getSchedule: (start: Dayjs, user: string) => Promise<{
        data: any[];
        default: boolean;
    } | null>;
    editScheduleItem: (params: {
        id: string;
        date: Date;
        start: string;
        end: string;
        personId?: string;
    }) => Promise<void>;
    deleteScheduleItem: (id: string) => Promise<void>;
    setDefaultSchedule: (weekStart: Dayjs) => Promise<void>;
    createSchedule: (scheduleStart: Dayjs) => Promise<void>;
    addOrEditScheduleRule: (params: {
        id?: string;
        days: number[];
        date?: Dayjs;
        start: Dayjs;
        end: Dayjs;
        employees: {
            jobId: string;
            amount: number;
            id?: string;
        }[];
    }) => Promise<(ScheduleRule & {
        rules: import("@mikro-orm/core").Collection<ScheduleRuleItem, unknown>;
    })[]>;
    deleteScheduleRule: (id: string) => Promise<void>;
    getScheduleStartDates: () => Promise<(Date | undefined)[]>;
}
