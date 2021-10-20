import { Collection, OneToMany, Property } from "@mikro-orm/core";
import { Entity } from "../utils/decorators";
import BaseEntity from "./BaseEntity";
import ScheduleItem from "./ScheduleItem";

@Entity()
export default class Schedule extends BaseEntity {
    @Property()
    isDefault!: boolean;

    @OneToMany(
        () => ScheduleItem,
        x => x.schedule
    )
    scheduleItems = new Collection<ScheduleItem>(this);

    constructor(params: { isDefault: boolean }) {
        super();
        const { isDefault } = params;
        this.isDefault = isDefault;
    }
}
