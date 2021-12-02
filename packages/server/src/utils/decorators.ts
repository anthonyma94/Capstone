/**
 * Holds all decorators used throughout the project.
 * Some decorators are extended from their respective libraries for DI purposes.
 */

import { Entity as ORMEntity, EntityOptions } from "@mikro-orm/core";
import {
    controller,
    httpDelete,
    httpGet,
    httpPatch,
    httpPost,
    httpPut,
    interfaces
} from "inversify-express-utils";
import {
    inject,
    ServiceIdentifierOrFunc
} from "inversify/lib/annotation/inject";
import { DI_TYPES } from "../types";

// Mikro-ORM Entity
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

// Shorthand decorator to inject a Mikro-ORM Repo
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

// Express Controller
export const Controller = (path?: string, ...middleware: any[]) => (
    target: Function
) => {
    // Uses controller name if no path is specified
    if (!path) {
        path = "/" + target.name.toLowerCase().replace(/controller$/g, "");
    }

    controller(path, ...middleware)(target);
};

// HTTP Verb factory
const decoratorFactory = (
    path: string,
    verb: HTTPVerbs,
    ...middleware: interfaces.Middleware[]
) => (target: Object, propertyKey: string, value: any) => {
    switch (verb) {
        case "get":
            httpGet(path, ...middleware)(target, propertyKey, value);
            break;
        case "post":
            httpPost(path, ...middleware)(target, propertyKey, value);
            break;
        case "delete":
            httpDelete(path, ...middleware)(target, propertyKey, value);
            break;
        case "put":
            httpPut(path, ...middleware)(target, propertyKey, value);
            break;
        case "patch":
            httpPatch(path, ...middleware)(target, propertyKey, value);
    }
};

// Relevant HTTP Verbs used for the project
export const Get = (path: string, ...middleware: interfaces.Middleware[]) => (
    target: Object,
    propertyKey: string,
    value: any
) => decoratorFactory(path, "get", ...middleware)(target, propertyKey, value);
export const Post = (path: string, ...middleware: interfaces.Middleware[]) => (
    target: Object,
    propertyKey: string,
    value: any
) => decoratorFactory(path, "post", ...middleware)(target, propertyKey, value);
export const Put = (path: string, ...middleware: interfaces.Middleware[]) => (
    target: Object,
    propertyKey: string,
    value: any
) => decoratorFactory(path, "put", ...middleware)(target, propertyKey, value);
export const Delete = (
    path: string,
    ...middleware: interfaces.Middleware[]
) => (target: Object, propertyKey: string, value: any) =>
    decoratorFactory(path, "delete", ...middleware)(target, propertyKey, value);
export const Patch = (path: string, ...middleware: interfaces.Middleware[]) => (
    target: Object,
    propertyKey: string,
    value: any
) => decoratorFactory(path, "patch", ...middleware)(target, propertyKey, value);
