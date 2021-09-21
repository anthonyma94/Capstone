import { provide } from "inversify-binding-decorators";
import { BaseService } from "./BaseService";
import Store from "../entities/Store";
import { InjectRepo } from "../utils/decorators";
import { EntityRepository, FindOptions } from "@mikro-orm/core";
import StoreHour from "../entities/StoreHour";
import StoreHourService from "./StoreHourService";

@provide(StoreService)
export class StoreService extends BaseService<Store> {
    constructor(@InjectRepo(Store) repo: any) {
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
}
