import BaseEntity from "./BaseEntity";
export default class DayItem extends BaseEntity {
    day?: DayNames;
    date?: Date;
    start: string;
    end: string;
    constructor(params: {
        start: string;
        end: string;
        day?: DayNames | number;
        date?: Date;
    });
}
export declare enum DayNames {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6
}
