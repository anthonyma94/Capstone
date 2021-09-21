import { Collection, OneToMany, Property } from "@mikro-orm/core";
import { Entity } from "../utils/decorators";
import BaseEntity from "./BaseEntity";
import StoreHour from "./StoreHour";

@Entity()
export default class Store extends BaseEntity {
    @Property()
    name!: string;

    @OneToMany(
        () => StoreHour,
        storeHour => storeHour.store
    )
    storeHours = new Collection<StoreHour>(this);

    constructor(name: string) {
        super();
        this.name = name;
    }
}
