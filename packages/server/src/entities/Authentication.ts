import { OneToOne, Property } from "@mikro-orm/core";
import { Entity } from "../utils/decorators";
import BaseEntity from "./BaseEntity";
import { Person } from "./Person";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

@Entity()
export default class Authentication extends BaseEntity {
    @OneToOne()
    person?: Person;

    @Property()
    username: string;

    @Property()
    password: string;

    @Property()
    role: string;

    constructor(options: {
        person?: Person;
        username: string;
        password: string;
        role: string;
    }) {
        super();
        this.person = options.person;
        this.username = options.username;
        this.password = Authentication.encryptPassword(options.password);
        this.role = options.role;
    }

    static encryptPassword(text: string) {
        return bcrypt.hashSync(text, SALT_ROUNDS);
    }

    static checkPassword(text: string, hashedPassword: string) {
        return bcrypt.compareSync(text, hashedPassword);
    }
}
