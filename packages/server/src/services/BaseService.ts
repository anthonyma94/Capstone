/**
 * Other services extend from this. These services follow a design pattern from ASP.NET,
 * where services are used by controllers to retrieve content from DB.
 *
 * Not all services used follow this pattern. Throughout the project I transitioned into
 * a more common pattern used in NodeJS, where services provide all needed functionalities,
 * and controllers merely call service methods and return its results. I found the new
 * design pattern to be easier to read and keep track of.
 */

import {
    GetRepository,
    EntityRepository,
    FilterQuery,
    FindOptions,
    QueryOrderMap,
    wrap
} from "@mikro-orm/core";
import { injectable } from "inversify";
import BaseEntity from "../entities/BaseEntity";

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
        return item;
    };

    public delete = async (entity: T) => {
        await this.repo.removeAndFlush(entity);
        return entity;
    };
}
