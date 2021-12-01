import { Collection } from "@mikro-orm/core";
import Availability from "./Availability";
import BaseEntity from "./BaseEntity";
import { JobTitle } from "./JobTitle";
import ScheduleItem from "./ScheduleItem";
import TimeOff from "./TimeOff";
export declare class Person extends BaseEntity {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    province: string;
    postal: string;
    role: string;
    pay: number;
    phone: string;
    maxWeeklyHours: number;
    jobTitle: JobTitle;
    timeOffs: Collection<TimeOff, unknown>;
    availabilities: Collection<Availability, unknown>;
    scheduleItems: Collection<ScheduleItem, unknown>;
    constructor(params: {
        firstName: string;
        lastName: string;
        address: string;
        province: string;
        city: string;
        postal: string;
        role: string;
        pay: number;
        phone: string;
        maxWeeklyHours: number;
        jobTitle: JobTitle;
    });
}
