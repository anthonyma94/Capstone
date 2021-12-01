import { Collection } from "@mikro-orm/core";
import BaseEntity from "./BaseEntity";
import DayItem from "./DayItem";
import ScheduleItem from "./ScheduleItem";
export default class Schedule extends BaseEntity {
    isDefault: boolean;
    start: DayItem;
    end: DayItem;
    scheduleItems: Collection<ScheduleItem, unknown>;
    constructor(params: {
        isDefault: boolean;
        start: DayItem;
        end: DayItem;
    });
}
