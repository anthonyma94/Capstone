import { GetRepository, EntityRepository, FilterQuery, FindOptions, QueryOrderMap } from "@mikro-orm/core";
import BaseEntity from "../entities/BaseEntity";
export declare abstract class BaseService<T extends BaseEntity> {
    protected repo: EntityRepository<T>;
    constructor(_repo: GetRepository<T, EntityRepository<T>>);
    getAll: (options?: FindOptions<T, any> | undefined) => Promise<T[]>;
    getOne: (id: string, populate?: any, orderBy?: QueryOrderMap | undefined) => Promise<T>;
    find: (where: FilterQuery<T>, populate?: any, orderBy?: QueryOrderMap | undefined) => Promise<T>;
    add: (entity: T | T[]) => Promise<T | T[]>;
    update: (entity: T) => Promise<T>;
    delete: (entity: T) => Promise<T>;
}
