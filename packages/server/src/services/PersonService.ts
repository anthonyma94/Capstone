import {
    EntityRepository,
    FindOneOptions,
    FindOptions,
    wrap
} from "@mikro-orm/core";
import { provide } from "inversify-binding-decorators";
import Availability from "../entities/Availability";
import { Person } from "../entities/Person";
import { InjectRepo } from "../utils/decorators";
import { BaseService } from "./BaseService";

import util from "util";
import DayItem from "../entities/DayItem";

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

    public update = async (entity: Person) => {
        const item = await this.getOne(entity.id);
        const data: Partial<Person> = entity;
        if (data.availabilities) delete data.availabilities;

        // console.log(data);

        const res = wrap(item).assign(data, {
            merge: true,
            mergeObjects: true
        });

        this.repo.flush();
        return res;
    };

    public addAvailabilities = async (
        id: string,
        availabilities: Availability[]
    ) => {
        try {
            const person = await this.getOne(id);
            for (let i of availabilities) {
                const item = new Availability({
                    ...i,
                    day: new DayItem(i.day),
                    person
                });
                this.availabilityRepo.persist(item);
                person.availabilities.add(item);
            }
            await this.repo.flush();
            return person;
        } catch (e) {
            console.error(e);
            throw e;
        }
    };

    public deleteAvailability = async (availability: Availability) => {
        const item = await this.availabilityRepo.findOneOrFail({
            id: availability.id
        });
        // const person = await this.getOne(availability.person.id);
        // if (!person) throw new Error("No person found with ID.");
        await this.repo.removeAndFlush(item);

        // person.availabilities.remove(availability);
        // await this.repo.flush();
    };

    public updateAvailability = async (availability: Availability) => {
        const person = await this.getOne(availability.person.id);
        if (!person) throw new Error("No person found with ID.");

        await this.repo.persistAndFlush(availability);
    };
}
