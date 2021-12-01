import { Collection } from "@mikro-orm/core";
import BaseEntity from "./BaseEntity";
import DayItem from "./DayItem";
import ScheduleRuleItem from "./ScheduleRuleItem";
export default class ScheduleRule extends BaseEntity {
    day: DayItem;
    rules: Collection<ScheduleRuleItem, unknown>;
    constructor(params: {
        day: DayItem;
    });
}
