import { Collection } from "@mikro-orm/core";
import BaseEntity from "./BaseEntity";
import StoreHour from "./StoreHour";
export default class Store extends BaseEntity {
    name: string;
    storeHours: Collection<StoreHour, unknown>;
    constructor(name: string);
}
