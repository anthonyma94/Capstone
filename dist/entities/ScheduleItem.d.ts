import BaseEntity from "./BaseEntity";
import DayItem from "./DayItem";
import { Person } from "./Person";
import Schedule from "./Schedule";
export default class ScheduleItem extends BaseEntity {
    schedule: Schedule;
    day: DayItem;
    person: Person;
    constructor(params: {
        day: DayItem;
        schedule: Schedule;
        person: Person;
        id?: string;
    });
}
