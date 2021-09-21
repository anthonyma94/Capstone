import { ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { Entity } from "../utils/decorators";
import BaseEntity from "./BaseEntity";
import DayItem from "./DayItem";
import Store from "./Store";

@Entity()
export default class StoreHour extends BaseEntity {
    @ManyToOne()
    store!: Store;

    @ManyToOne()
    day!: DayItem;

    constructor(store: Store, day: DayItem) {
        super();
        this.store = store;
        this.day = day;
    }
}
