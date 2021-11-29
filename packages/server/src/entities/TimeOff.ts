import { ManyToOne, Property } from "@mikro-orm/core";
import { Entity } from "../utils/decorators";
import BaseEntity from "./BaseEntity";
import DayItem from "./DayItem";
import { Person } from "./Person";

@Entity()
export default class TimeOff extends BaseEntity {
    @ManyToOne()
    person!: Person;

    @Property()
    reason!: string;

    @ManyToOne()
    start!: DayItem;

    @ManyToOne()
    end!: DayItem;

    @Property()
    isApproved?: boolean;

    constructor(params: {
        person: Person;
        reason: string;
        start: DayItem;
        end: DayItem;
        isApproved?: boolean;
    }) {
        super();

        this.person = params.person;
        this.reason = params.reason;
        this.start = params.start;
        this.end = params.end;
        this.isApproved = params.isApproved;
    }
}
