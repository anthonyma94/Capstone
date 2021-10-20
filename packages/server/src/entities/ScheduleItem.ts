import { ManyToOne, Property } from "@mikro-orm/core";
import { Entity } from "../utils/decorators";
import BaseEntity from "./BaseEntity";
import DayItem from "./DayItem";
import Schedule from "./Schedule";

@Entity()
export default class ScheduleItem extends BaseEntity {
    @ManyToOne()
    schedule!: Schedule;

    @ManyToOne()
    day!: DayItem;

    constructor(params: { day: DayItem; schedule: Schedule }) {
        super();
        const { day, schedule } = params;
        this.day = day;
        this.schedule = schedule;
    }
}
