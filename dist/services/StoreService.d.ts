import { BaseService } from "./BaseService";
import Store from "../entities/Store";
import { EntityRepository, FindOptions } from "@mikro-orm/core";
import StoreHour from "../entities/StoreHour";
import { Dayjs } from "dayjs";
export declare class StoreService extends BaseService<Store> {
    private storeHourRepo;
    constructor(repo: EntityRepository<Store>, storeHourRepo: EntityRepository<StoreHour>);
    getAll: (options?: FindOptions<Store, any> | undefined) => Promise<Store[]>;
    changeHours: (storeId: string, hours: {
        id?: string;
        start: Dayjs;
        end: Dayjs;
    }[]) => Promise<(StoreHour & {})[]>;
}
