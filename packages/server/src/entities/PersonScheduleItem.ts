import { ManyToOne, Property } from "@mikro-orm/core";
import { Entity } from "../utils/decorators";
import BaseEntity from "./BaseEntity";
import { Person } from "./Person";
import ScheduleItem from "./ScheduleItem";

@Entity()
export default class PersonScheduleItem extends BaseEntity {
    @ManyToOne()
    person!: Person;

    @ManyToOne()
    scheduleItem!: ScheduleItem;

    constructor(params: { person: Person; item: ScheduleItem }) {
        super();
        this.person = params.person;
        this.scheduleItem = params.item;
    }
}
