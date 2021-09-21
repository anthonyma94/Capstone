import { Entity as ORMEntity, EntityOptions } from "@mikro-orm/core";
import { decorate, injectable } from "inversify";
import {
    controller,
    httpDelete,
    httpGet,
    httpPatch,
    httpPost,
    httpPut
} from "inversify-express-utils";
import {
    inject,
    ServiceIdentifierOrFunc
} from "inversify/lib/annotation/inject";
import { DI_TYPES } from "../types";

export const Entity = (options?: EntityOptions<any>) => (target: any) => {
    ORMEntity(options)(target);
    const currentMetadata = target;

    const previousMetadata =
        Reflect.getMetadata(DI_TYPES.REPOSITORY, Reflect) || [];

    Reflect.defineMetadata(
        DI_TYPES.REPOSITORY,
        [...previousMetadata, currentMetadata],
        Reflect
    );
};

export const InjectRepo = (serviceIdentifer: ServiceIdentifierOrFunc) => (
    target: Object,
    propertyKey: string,
    index?: any
) => {
    const binding = Symbol.for((serviceIdentifer as Object & Function).name);
    inject(binding)(target, propertyKey, index);
};

type HTTPVerbs = "get" | "post" | "put" | "delete" | "patch";

export interface RouteDefinition {
    path: string;
    requestMethod: HTTPVerbs;
    methodName: string;
}

export const Controller = (path?: string) => (target: Function) => {
    // Uses controller name if no path is specified
    if (!path) {
        path = "/" + target.name.toLowerCase().replace(/controller$/g, "");
    }

    controller(path)(target);
};

const decoratorFactory = (path: string, verb: HTTPVerbs) => (
    target: Object,
    propertyKey: string,
    value: any
) => {
    switch (verb) {
        case "get":
            httpGet(path)(target, propertyKey, value);
            break;
        case "post":
            httpPost(path)(target, propertyKey, value);
            break;
        case "delete":
            httpDelete(path)(target, propertyKey, value);
            break;
        case "put":
            httpPut(path)(target, propertyKey, value);
            break;
        case "patch":
            httpPatch(path)(target, propertyKey, value);
    }
};

export const Get = (path: string) => (
    target: Object,
    propertyKey: string,
    value: any
) => decoratorFactory(path, "get")(target, propertyKey, value);
export const Post = (path: string) => (
    target: Object,
    propertyKey: string,
    value: any
) => decoratorFactory(path, "post")(target, propertyKey, value);
export const Put = (path: string) => (
    target: Object,
    propertyKey: string,
    value: any
) => decoratorFactory(path, "put")(target, propertyKey, value);
export const Delete = (path: string) => (
    target: Object,
    propertyKey: string,
    value: any
) => decoratorFactory(path, "delete")(target, propertyKey, value);
export const Patch = (path: string) => (
    target: Object,
    propertyKey: string,
    value: any
) => decoratorFactory(path, "patch")(target, propertyKey, value);
