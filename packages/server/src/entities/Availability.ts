import { ManyToOne, Property } from "@mikro-orm/core";
import { injectable } from "inversify";
import { Entity } from "../utils/decorators";
import BaseEntity from "./BaseEntity";
import DayItem from "./DayItem";
import { Person } from "./Person";

@Entity()
export default class Availability extends BaseEntity {
    @ManyToOne()
    person!: Person;

    @Property()
    isApproved!: boolean;

    @ManyToOne()
    day!: DayItem;

    constructor(options: {
        person: Person;
        isApproved: boolean;
        day: DayItem;
    }) {
        super();
        const { person, isApproved, day } = options;
        this.person = person;
        this.isApproved = isApproved;
        this.day = day;
    }
}
