import { EntityRepository, FindOneOptions, FindOptions } from "@mikro-orm/core";
import { provide } from "inversify-binding-decorators";
import Availability from "../entities/Availability";
import { Person } from "../entities/Person";
import { InjectRepo } from "../utils/decorators";
import { BaseService } from "./BaseService";

@provide(PersonService)
export default class PersonService extends BaseService<Person> {
    // private availabilityRepo: EntityRepository<Availability>;
    constructor(
        @InjectRepo(Person) repo: any,
        @InjectRepo(Availability)
        private availabilityRepo: EntityRepository<Availability>
    ) {
        super(repo);
        // this.availabilityRepo = availabilityRepo;
    }

    public getOne = async (
        id: string,
        options?: FindOneOptions<Person, any>
    ) => {
        const res = await this.repo.findOneOrFail(id, {
            populate: { jobTitle: true, availabilities: { day: true } },
            ...options
        });
        return res;
    };

    public getAll = async (options?: FindOptions<Person, any>) => {
        const res = await this.repo.findAll({
            populate: {
                jobTitle: true,
                availabilities: { day: true }
            },
            ...options
        });
        return res;
    };

    public async addAvailabilities(id: string, availabilities: Availability[]) {
        const person = await this.getOne(id);
        if (!person) throw new Error("No person found with ID.");

        person.availabilities.add(...availabilities);
        await this.repo.flush();
    }

    public async deleteAvailability(availability: Availability) {
        const person = await this.getOne(availability.person.id);
        if (!person) throw new Error("No person found with ID.");

        person.availabilities.remove(availability);
        await this.repo.flush();
    }

    public async updateAvailability(availability: Availability) {
        const person = await this.getOne(availability.person.id);
        if (!person) throw new Error("No person found with ID.");

        await this.repo.persistAndFlush(availability);
    }
}
