import {
    GetRepository,
    EntityRepository,
    FilterQuery,
    FindOptions,
    QueryOrderMap,
    wrap,
    Primary
} from "@mikro-orm/core";
import { injectable } from "inversify";
import BaseEntity from "../entities/BaseEntity";
import util from "util";

@injectable()
export abstract class BaseService<T extends BaseEntity> {
    protected repo: EntityRepository<T>;
    constructor(_repo: GetRepository<T, EntityRepository<T>>) {
        this.repo = _repo;
    }

    public getAll = async (options?: FindOptions<T, any>) => {
        return await this.repo.findAll(options);
    };

    public getOne = async (
        id: string,
        populate?: any,
        orderBy?: QueryOrderMap
    ) => {
        return await this.repo.findOneOrFail(
            id as FilterQuery<T>,
            populate,
            orderBy
        );
    };

    public find = async (
        where: FilterQuery<T>,
        populate?: any,
        orderBy?: QueryOrderMap
    ) => {
        return await this.repo.findOneOrFail(where, populate, orderBy);
    };

    public add = async (entity: T | T[]) => {
        await this.repo.persistAndFlush(entity);
        return entity;
    };

    public update = async (entity: T) => {
        const item = await this.getOne(entity.id);
        wrap(item).assign(entity, {
            merge: true,
            mergeObjects: true,
            updateNestedEntities: true
        });
        await this.repo.flush();
        // console.log(util.inspect(item, { depth: null, colors: true }));
        // console.log(item);
        return item;
    };

    public delete = async (entity: T) => {
        await this.repo.removeAndFlush(entity);
        return entity;
    };
}
