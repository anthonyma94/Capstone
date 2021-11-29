import { ManyToOne, Property } from "@mikro-orm/core";
import { Entity } from "../utils/decorators";
import BaseEntity from "./BaseEntity";
import DayItem from "./DayItem";
import { Person } from "./Person";
import Schedule from "./Schedule";

@Entity()
export default class ScheduleItem extends BaseEntity {
    @ManyToOne()
    schedule!: Schedule;

    @ManyToOne()
    day!: DayItem;

    @ManyToOne()
    person!: Person;

    constructor(params: {
        day: DayItem;
        schedule: Schedule;
        person: Person;
        id?: string;
    }) {
        super();
        const { day, schedule, person } = params;
        if (params.id) this.id = params.id;
        this.day = day;
        this.schedule = schedule;
        this.person = person;
    }
}
