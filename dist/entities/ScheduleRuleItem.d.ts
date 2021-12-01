import BaseEntity from "./BaseEntity";
import { JobTitle } from "./JobTitle";
import ScheduleRule from "./ScheduleRule";
export default class ScheduleRuleItem extends BaseEntity {
    jobTitle: JobTitle;
    scheduleRule: ScheduleRule;
    amount: number;
    constructor(params: {
        scheduleRule: ScheduleRule;
        jobTitle: JobTitle;
        amount: number;
    });
}
