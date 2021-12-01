import { Collection, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { inject, injectable } from "inversify";
import JobTitleService from "../services/JobTitleService";
import { Entity } from "../utils/decorators";
import Availability from "./Availability";
import BaseEntity from "./BaseEntity";
import { JobTitle } from "./JobTitle";
import ScheduleItem from "./ScheduleItem";
import TimeOff from "./TimeOff";

@Entity()
@injectable()
export class Person extends BaseEntity {
    @Property()
    firstName!: string;

    @Property()
    lastName!: string;

    @Property()
    address!: string;

    @Property()
    city!: string;

    @Property()
    province!: string;

    @Property()
    postal!: string;

    @Property()
    role!: string;

    @Property({ columnType: "float" })
    pay!: number;

    @Property()
    phone!: string;

    @Property()
    maxWeeklyHours!: number;

    @ManyToOne()
    jobTitle!: JobTitle;

    @OneToMany(
        () => TimeOff,
        time => time.person
    )
    timeOffs = new Collection<TimeOff>(this);

    @OneToMany(
        () => Availability,
        availability => availability.person
    )
    availabilities = new Collection<Availability>(this);

    @OneToMany(
        () => ScheduleItem,
        x => x.person
    )
    scheduleItems = new Collection<ScheduleItem>(this);

    constructor(
        params: {
            firstName: string;
            lastName: string;
            address: string;
            province: string;
            city: string;
            postal: string;
            role: string;
            pay: number;
            phone: string;
            maxWeeklyHours: number;
            jobTitle: JobTitle;
        }
        // @inject(JobTitleService) jobTitleService?: JobTitleService
    ) {
        super();
        this.firstName = params.firstName;
        this.lastName = params.lastName;
        this.address = params.address;
        this.province = params.province;
        this.city = params.city;
        this.postal = params.postal;
        this.role = params.role;
        this.phone = params.phone;
        this.pay = params.pay;
        this.maxWeeklyHours = params.maxWeeklyHours;
        this.jobTitle = params.jobTitle;

        // if (typeof params.jobTitle === "string") {
        //     jobTitleService!.find({ name: params.jobTitle }).then(res => {
        //         if (!res) throw new Error("Job Title not found.");
        //         this.jobTitle = res;
        //     });
        // } else {
        //     this.jobTitle = params.jobTitle;
        // }
    }
}
