import { Collection, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { Entity } from "../utils/decorators";
import BaseEntity from "./BaseEntity";
import { JobTitle } from "./JobTitle";
import ScheduleItem from "./ScheduleItem";
import ScheduleRule from "./ScheduleRule";

@Entity()
export default class ScheduleRuleItem extends BaseEntity {
    @ManyToOne()
    jobTitle: JobTitle;

    @ManyToOne()
    scheduleRule: ScheduleRule;

    @Property()
    amount: number;

    constructor(params: {
        scheduleRule: ScheduleRule;
        jobTitle: JobTitle;
        amount: number;
    }) {
        super();
        this.jobTitle = params.jobTitle;
        this.scheduleRule = params.scheduleRule;
        this.amount = params.amount;
    }
}
