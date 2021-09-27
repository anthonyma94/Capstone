"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Patch = exports.Delete = exports.Put = exports.Post = exports.Get = exports.Controller = exports.InjectRepo = exports.Entity = void 0;
const core_1 = require("@mikro-orm/core");
const inversify_express_utils_1 = require("inversify-express-utils");
const inject_1 = require("inversify/lib/annotation/inject");
const types_1 = require("../types");
const Entity = (options) => (target) => {
    (0, core_1.Entity)(options)(target);
    const currentMetadata = target;
    const previousMetadata = Reflect.getMetadata(types_1.DI_TYPES.REPOSITORY, Reflect) || [];
    Reflect.defineMetadata(types_1.DI_TYPES.REPOSITORY, [...previousMetadata, currentMetadata], Reflect);
};
exports.Entity = Entity;
const InjectRepo = (serviceIdentifer) => (target, propertyKey, index) => {
    const binding = Symbol.for(serviceIdentifer.name);
    (0, inject_1.inject)(binding)(target, propertyKey, index);
};
exports.InjectRepo = InjectRepo;
const Controller = (path) => (target) => {
    if (!path) {
        path = "/" + target.name.toLowerCase().replace(/controller$/g, "");
    }
    (0, inversify_express_utils_1.controller)(path)(target);
};
exports.Controller = Controller;
const decoratorFactory = (path, verb) => (target, propertyKey, value) => {
    switch (verb) {
        case "get":
            (0, inversify_express_utils_1.httpGet)(path)(target, propertyKey, value);
            break;
        case "post":
            (0, inversify_express_utils_1.httpPost)(path)(target, propertyKey, value);
            break;
        case "delete":
            (0, inversify_express_utils_1.httpDelete)(path)(target, propertyKey, value);
            break;
        case "put":
            (0, inversify_express_utils_1.httpPut)(path)(target, propertyKey, value);
            break;
        case "patch":
            (0, inversify_express_utils_1.httpPatch)(path)(target, propertyKey, value);
    }
};
const Get = (path) => (target, propertyKey, value) => decoratorFactory(path, "get")(target, propertyKey, value);
exports.Get = Get;
const Post = (path) => (target, propertyKey, value) => decoratorFactory(path, "post")(target, propertyKey, value);
exports.Post = Post;
const Put = (path) => (target, propertyKey, value) => decoratorFactory(path, "put")(target, propertyKey, value);
exports.Put = Put;
const Delete = (path) => (target, propertyKey, value) => decoratorFactory(path, "delete")(target, propertyKey, value);
exports.Delete = Delete;
const Patch = (path) => (target, propertyKey, value) => decoratorFactory(path, "patch")(target, propertyKey, value);
exports.Patch = Patch;
