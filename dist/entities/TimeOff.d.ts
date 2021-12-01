import BaseEntity from "./BaseEntity";
import DayItem from "./DayItem";
import { Person } from "./Person";
export default class TimeOff extends BaseEntity {
    person: Person;
    reason: string;
    start: DayItem;
    end: DayItem;
    isApproved?: boolean;
    constructor(params: {
        person: Person;
        reason: string;
        start: DayItem;
        end: DayItem;
        isApproved?: boolean;
    });
}
