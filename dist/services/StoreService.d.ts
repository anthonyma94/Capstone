import { BaseService } from "./BaseService";
import Store from "../entities/Store";
import { FindOptions } from "@mikro-orm/core";
export declare class StoreService extends BaseService<Store> {
    constructor(repo: any);
    getAll: (options?: FindOptions<Store, any> | undefined) => Promise<Store[]>;
}
