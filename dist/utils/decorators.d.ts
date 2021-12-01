import { EntityOptions } from "@mikro-orm/core";
import { interfaces } from "inversify-express-utils";
import { ServiceIdentifierOrFunc } from "inversify/lib/annotation/inject";
export declare const Entity: (options?: EntityOptions<any> | undefined) => (target: any) => void;
export declare const InjectRepo: (serviceIdentifer: ServiceIdentifierOrFunc) => (target: Object, propertyKey: string, index?: any) => void;
declare type HTTPVerbs = "get" | "post" | "put" | "delete" | "patch";
export interface RouteDefinition {
    path: string;
    requestMethod: HTTPVerbs;
    methodName: string;
}
export declare const Controller: (path?: string | undefined, ...middleware: any[]) => (target: Function) => void;
export declare const Get: (path: string, ...middleware: interfaces.Middleware[]) => (target: Object, propertyKey: string, value: any) => void;
export declare const Post: (path: string, ...middleware: interfaces.Middleware[]) => (target: Object, propertyKey: string, value: any) => void;
export declare const Put: (path: string, ...middleware: interfaces.Middleware[]) => (target: Object, propertyKey: string, value: any) => void;
export declare const Delete: (path: string, ...middleware: interfaces.Middleware[]) => (target: Object, propertyKey: string, value: any) => void;
export declare const Patch: (path: string, ...middleware: interfaces.Middleware[]) => (target: Object, propertyKey: string, value: any) => void;
export {};
