import { EntityRepository } from "@mikro-orm/core";
import { Dayjs } from "dayjs";
import { Person } from "../entities/Person";
import TimeOff from "../entities/TimeOff";
export default class RequestService {
    private timeOffRepo;
    private personRepo;
    constructor(timeOffRepo: EntityRepository<TimeOff>, personRepo: EntityRepository<Person>);
    getTimeOffRequest(person?: string): Promise<(TimeOff & {})[]>;
    createTimeOffRequest(params: {
        person: string;
        start: Dayjs;
        end: Dayjs;
        reason: string;
    }): Promise<TimeOff & {}>;
    approveOrDenyTimeOffRequest(id: string, decision: boolean): Promise<TimeOff>;
}
