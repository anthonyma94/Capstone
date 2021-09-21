import { Property } from "@mikro-orm/core";
import { Entity } from "../utils/decorators";
import BaseEntity from "./BaseEntity";

@Entity()
export class JobTitle extends BaseEntity {
    @Property()
    name!: string;

    constructor(name: string) {
        super();
        this.name = name;
    }
}
