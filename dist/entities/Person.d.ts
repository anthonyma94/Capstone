import { Collection } from "@mikro-orm/core";
import JobTitleService from "../services/JobTitleService";
import Availability from "./Availability";
import BaseEntity from "./BaseEntity";
import { JobTitle } from "./JobTitle";
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
    availabilities: Collection<Availability, unknown>;
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
        jobTitle: string | JobTitle;
    }, jobTitleService?: JobTitleService);
}
