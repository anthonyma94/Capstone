import BaseEntity from "./BaseEntity";
import { Person } from "./Person";
export default class Authentication extends BaseEntity {
    person?: Person;
    username: string;
    password: string;
    role: string;
    constructor(options: {
        person?: Person;
        username: string;
        password: string;
        role: string;
    });
    static encryptPassword(text: string): string;
    static checkPassword(text: string, hashedPassword: string): boolean;
}
