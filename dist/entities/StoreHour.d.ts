import BaseEntity from "./BaseEntity";
import DayItem from "./DayItem";
import Store from "./Store";
export default class StoreHour extends BaseEntity {
    store: Store;
    day: DayItem;
    constructor(store: Store, day: DayItem);
}
