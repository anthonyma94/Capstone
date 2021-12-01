import { EntityRepository, FindOneOptions, FindOptions } from "@mikro-orm/core";
import Availability from "../entities/Availability";
import { Person } from "../entities/Person";
import { BaseService } from "./BaseService";
import { Dayjs } from "dayjs";
import Authentication from "../entities/Authentication";
export default class PersonService extends BaseService<Person> {
    private availabilityRepo;
    private authRepo;
    constructor(repo: any, availabilityRepo: EntityRepository<Availability>, authRepo: EntityRepository<Authentication>);
    getOne: (id: string, options?: FindOneOptions<Person, any> | undefined) => Promise<Person>;
    getAll: (options?: FindOptions<Person, any> | undefined) => Promise<Person[]>;
    update: (entity: Person) => Promise<Person>;
    addAvailabilities: (params: {
        personId: string;
        availabilities: {
            start: string;
            end: string;
            day: number;
        }[];
    }) => Promise<(Availability & {})[]>;
    deleteAvailability: (id: string) => Promise<void>;
    editAvailability: (params: {
        id: string;
        start: Dayjs;
        end: Dayjs;
        day: number;
    }) => Promise<Availability & {}>;
    updatePerson: (params: {
        pay: number;
        maxWeeklyHours: number;
        jobTitle: string;
        role: string;
        id: string;
        firstName: string;
        lastName: string;
        address: string;
        province: string;
        postal: string;
        city: string;
        phone: string;
    }) => Promise<Person & {
        scheduleItems: import("@mikro-orm/core").Collection<import("../entities/ScheduleItem").default, unknown>;
        timeOffs: import("@mikro-orm/core").Collection<import("../entities/TimeOff").default, unknown>;
        availabilities: import("@mikro-orm/core").Collection<Availability, unknown>;
    }>;
}
