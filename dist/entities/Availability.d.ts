import BaseEntity from "./BaseEntity";
import DayItem from "./DayItem";
import { Person } from "./Person";
export default class Availability extends BaseEntity {
    person: Person;
    isApproved: boolean;
    day: DayItem;
    constructor(options: {
        person: Person;
        isApproved: boolean;
        day: DayItem;
    });
}
