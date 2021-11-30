import { provide } from "inversify-binding-decorators";
import { BaseService } from "./BaseService";
import Store from "../entities/Store";
import { InjectRepo } from "../utils/decorators";
import { EntityRepository, FindOptions } from "@mikro-orm/core";
import StoreHour from "../entities/StoreHour";
import { Dayjs } from "dayjs";
import DayItem from "../entities/DayItem";

@provide(StoreService)
export class StoreService extends BaseService<Store> {
    constructor(
        @InjectRepo(Store) repo: EntityRepository<Store>,
        @InjectRepo(StoreHour)
        private storeHourRepo: EntityRepository<StoreHour>
    ) {
        super(repo);
    }

    public getAll = async (options?: FindOptions<Store, any>) => {
        const res = await this.repo.findAll({
            populate: {
                storeHours: { day: true }
            },
            ...options
        });

        return res;
    };

    public changeHours = async (
        storeId: string,
        hours: { id?: string; start: Dayjs; end: Dayjs }[]
    ) => {
        for (const hour of hours) {
            if (!hour.id) {
                const dayItem = new DayItem({
                    start: hour.start.format("HH:mm"),
                    end: hour.end.format("HH:mm"),
                    day: hour.start.day()
                });
                const item = new StoreHour(storeId as any, dayItem);
                this.storeHourRepo.persist(item);
            } else {
                const item = await this.storeHourRepo.findOneOrFail(
                    { id: hour.id },
                    ["day"]
                );
                item.day.start = hour.start.format("HH:mm");
                item.day.end = hour.end.format("HH:mm");
            }
        }

        await this.storeHourRepo.flush();
        return await this.storeHourRepo.find({ store: storeId }, ["day"]);
    };
}
