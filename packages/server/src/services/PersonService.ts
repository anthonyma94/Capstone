/**
 * This service uses a combination of NodeJS and ASP.NET patterns (refer to BaseService).
 */

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
import DayItem from "../entities/DayItem";
import dayjs, { Dayjs } from "dayjs";
import Authentication from "../entities/Authentication";

@provide(PersonService)
export default class PersonService extends BaseService<Person> {
    constructor(
        @InjectRepo(Person) repo: any,
        @InjectRepo(Availability)
        private availabilityRepo: EntityRepository<Availability>,
        @InjectRepo(Authentication)
        private authRepo: EntityRepository<Authentication>
    ) {
        super(repo);
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

        const res = wrap(item).assign(data, {
            merge: true,
            mergeObjects: true
        });

        this.repo.flush();
        return res;
    };

    public addAvailabilities = async (params: {
        personId: string;
        availabilities: {
            start: string;
            end: string;
            day: number;
        }[];
    }) => {
        // Checks existing availabilities to make sure new availabilities don't overlap.
        const existingAvailabilities = (
            await this.repo.findOneOrFail({ id: params.personId }, [
                "availabilities.day"
            ])
        ).availabilities;

        params.availabilities = params.availabilities.filter(x => {
            const start = dayjs(x.start, "HH:mm");
            const end = dayjs(x.end, "HH:mm");
            const overlaps = existingAvailabilities.getItems().some(y => {
                const bStart = dayjs(y.day.start, "HH:mm");
                const bEnd = dayjs(y.day.end, "HH:mm");
                const res =
                    x.day === y.day.day &&
                    !(
                        end.isSameOrBefore(bStart, "minute") ||
                        start.isSameOrAfter(bEnd, "minute")
                    );
                return res;
            });
            return !overlaps;
        });

        const availabilities = [] as Availability[];
        for (const i of params.availabilities) {
            const item = new Availability({
                person: params.personId as any,
                isApproved: true,
                day: new DayItem({
                    start: i.start,
                    end: i.end,
                    day: i.day
                })
            });
            availabilities.push(item);
        }

        if (availabilities.length > 0) {
            await this.availabilityRepo.persistAndFlush(availabilities);
        }

        const res =
            availabilities.length > 0
                ? await this.availabilityRepo.find(
                      { id: { $in: availabilities.map(x => x.id) } },
                      ["day"]
                  )
                : [];

        return res;
    };

    public deleteAvailability = async (id: string) => {
        const items = await this.availabilityRepo.findOneOrFail({ id });
        await this.availabilityRepo.removeAndFlush(items);
    };

    public editAvailability = async (params: {
        id: string;
        start: Dayjs;
        end: Dayjs;
        day: number;
    }) => {
        const item = await this.availabilityRepo.findOneOrFail(
            { id: params.id },
            ["day"]
        );

        item.day.start = params.start.format("HH:mm");
        item.day.end = params.end.format("HH:mm");
        item.day.day = params.day;

        await this.availabilityRepo.flush();

        return item;
    };

    public addOrUpdatePerson = async (params: {
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
    }) => {
        if (params.id !== "new") {
            const item = await this.repo.findOneOrFail({ id: params.id });

            item.firstName = params.firstName;
            item.lastName = params.lastName;
            item.address = params.address;
            item.province = params.province;
            item.postal = params.postal;
            item.city = params.city;
            item.phone = params.phone;
            item.pay = params.pay;
            item.maxWeeklyHours = params.maxWeeklyHours;
            item.jobTitle = params.jobTitle as any;
            item.role = params.role;
        } else {
            const existing = await this.repo.find({
                firstName:
                    params.firstName.charAt(0).toUpperCase() +
                    params.firstName.slice(1).toLowerCase(),
                lastName:
                    params.lastName.charAt(0).toUpperCase() +
                    params.lastName.slice(1).toLowerCase(),
                phone: params.phone
            });

            // Person already exists
            if (existing && existing.length > 0) {
                return;
            }

            const item = new Person({
                firstName:
                    params.firstName.charAt(0).toUpperCase() +
                    params.firstName.slice(1).toLowerCase(),
                lastName:
                    params.lastName.charAt(0).toUpperCase() +
                    params.lastName.slice(1).toLowerCase(),
                address: params.address,
                province: params.province,
                city: params.city,
                postal: params.postal,
                role: params.role,
                pay: params.pay,
                phone: params.phone,
                maxWeeklyHours: params.maxWeeklyHours,
                jobTitle: params.jobTitle as any
            });

            let username =
                item.firstName.charAt(0).toLowerCase() +
                item.lastName.toLowerCase();
            let count = 1;

            // Check if username already exists, adds a number to the new username if it does.
            try {
                while (true) {
                    await this.authRepo.findOneOrFail({ username });
                    if (isNaN(parseInt(username.charAt(username.length - 1)))) {
                        username += count.toString();
                    } else {
                        username =
                            username.slice(0, username.length - 2) +
                            count.toString();
                    }
                    count++;
                }
            } catch {}

            const auth = new Authentication({
                person: item,
                username,
                password: "password",
                role: "user"
            });

            this.repo.persist(item);
            await this.authRepo.persistAndFlush(auth);
            params.id = item.id;
        }
        await this.repo.flush();

        const res = await this.repo.findOneOrFail({ id: params.id }, [
            "availabilities.day",
            "jobTitle"
        ]);
        return res;
    };
}
