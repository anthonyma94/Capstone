import { Collection, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { Entity } from "../utils/decorators";
import BaseEntity from "./BaseEntity";
import DayItem from "./DayItem";
import ScheduleItem from "./ScheduleItem";
import ScheduleRuleItem from "./ScheduleRuleItem";

@Entity()
export default class ScheduleRule extends BaseEntity {
    @ManyToOne()
    day!: DayItem;

    @OneToMany(
        () => ScheduleRuleItem,
        x => x.scheduleRule
    )
    rules = new Collection<ScheduleRuleItem>(this);

    constructor(params: { day: DayItem }) {
        super();
        this.day = params.day;
    }
}
