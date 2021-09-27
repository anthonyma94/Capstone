import { EntityRepository, FindOneOptions, FindOptions } from "@mikro-orm/core";
import Availability from "../entities/Availability";
import { Person } from "../entities/Person";
import { BaseService } from "./BaseService";
export default class PersonService extends BaseService<Person> {
    private availabilityRepo;
    constructor(repo: any, availabilityRepo: EntityRepository<Availability>);
    getOne: (id: string, options?: FindOneOptions<Person, any> | undefined) => Promise<Person>;
    getAll: (options?: FindOptions<Person, any> | undefined) => Promise<Person[]>;
    update: (entity: Person) => Promise<Person>;
    addAvailabilities: (id: string, availabilities: Availability[]) => Promise<Person>;
    deleteAvailability: (availability: Availability) => Promise<void>;
    updateAvailability: (availability: Availability) => Promise<void>;
}
