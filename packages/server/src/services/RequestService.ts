import { EntityRepository } from "@mikro-orm/core";
import { Dayjs } from "dayjs";
import { provide } from "inversify-binding-decorators";
import DayItem from "../entities/DayItem";
import { Person } from "../entities/Person";
import TimeOff from "../entities/TimeOff";
import { InjectRepo } from "../utils/decorators";

@provide(RequestService)
export default class RequestService {
    constructor(
        @InjectRepo(TimeOff) private timeOffRepo: EntityRepository<TimeOff>,
        @InjectRepo(Person) private personRepo: EntityRepository<Person>
    ) {}

    public async getTimeOffRequest(person?: string) {
        const items = person
            ? await this.timeOffRepo.find({ person }, ["start", "end"])
            : await this.timeOffRepo.findAll({ populate: ["start", "end"] });

        return items;
    }

    public async serializeTimeOff(timeoff: string) {
        const item = await this.timeOffRepo.findOneOrFail({ id: timeoff }, [
            "start",
            "end"
        ]);
        return item;
    }

    public async createTimeOffRequest(params: {
        person: string;
        start: Dayjs;
        end: Dayjs;
        reason: string;
    }) {
        const person = await this.personRepo.findOneOrFail({
            id: params.person
        });

        const start = new DayItem({
            start: params.start.format("HH:mm"),
            end: params.start.format("HH:mm"),
            date: params.end.format("YYYY-MM-DD") as any
        });

        const end = new DayItem({
            start: params.end.format("HH:mm"),
            end: params.end.format("HH:mm"),
            date: params.end.format("YYYY-MM-DD") as any
        });

        const item = new TimeOff({ person, start, end, reason: params.reason });

        this.timeOffRepo.persist(item);

        await this.timeOffRepo.flush();

        return this.serializeTimeOff(item.id);
    }

    public async approveOrDenyTimeOffRequest(id: string, decision: boolean) {
        const item = await this.timeOffRepo.findOneOrFail({ id });

        item.isApproved = decision;

        await this.timeOffRepo.flush();
        return item;
    }
}
