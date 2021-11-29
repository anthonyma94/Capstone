import { Collection, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { Entity } from "../utils/decorators";
import BaseEntity from "./BaseEntity";
import DayItem from "./DayItem";
import ScheduleItem from "./ScheduleItem";

@Entity()
export default class Schedule extends BaseEntity {
    @Property()
    isDefault!: boolean;

    @ManyToOne()
    start: DayItem;

    @ManyToOne()
    end: DayItem;

    @OneToMany(
        () => ScheduleItem,
        x => x.schedule
    )
    scheduleItems = new Collection<ScheduleItem>(this);

    constructor(params: { isDefault: boolean; start: DayItem; end: DayItem }) {
        super();
        const { isDefault } = params;
        this.isDefault = isDefault;
        this.start = params.start;
        this.end = params.end;
    }
}
