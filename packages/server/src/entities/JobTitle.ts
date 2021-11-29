import { Property } from "@mikro-orm/core";
import { Entity } from "../utils/decorators";
import BaseEntity from "./BaseEntity";

@Entity()
export class JobTitle extends BaseEntity {
    @Property()
    name!: string;

    @Property()
    color!: string;

    constructor(name: string, color: string) {
        super();
        this.name = name;
        this.color = color;
    }
}
