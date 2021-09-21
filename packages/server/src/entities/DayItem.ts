// export default interface DayItem {
//     id: string;
//     day?: number;
//     date?: string;
//     start: string;
//     end: string;
// }

import { DateType, Enum, Property, TimeType } from "@mikro-orm/core";
import { Entity } from "../utils/decorators";
import BaseEntity from "./BaseEntity";

@Entity()
export default class DayItem extends BaseEntity {
    @Enum()
    @Property()
    day?: DayNames;

    @Property({ type: DateType })
    date?: Date;

    @Property({ type: TimeType })
    start!: string;

    @Property({ type: TimeType })
    end!: string;

    constructor(
        start: string,
        end: string,
        day?: DayNames | number,
        date?: Date
    ) {
        super();
        if (day === undefined && !date) {
            throw new Error("DayItem must have either a day or date.");
        }
        this.day = day;
        this.date = date;
        this.start = start;
        this.end = end;
    }
}

export enum DayNames {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6
}
