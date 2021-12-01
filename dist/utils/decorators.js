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
const Controller = (path, ...middleware) => (target) => {
    if (!path) {
        path = "/" + target.name.toLowerCase().replace(/controller$/g, "");
    }
    (0, inversify_express_utils_1.controller)(path, ...middleware)(target);
};
exports.Controller = Controller;
const decoratorFactory = (path, verb, ...middleware) => (target, propertyKey, value) => {
    switch (verb) {
        case "get":
            (0, inversify_express_utils_1.httpGet)(path, ...middleware)(target, propertyKey, value);
            break;
        case "post":
            (0, inversify_express_utils_1.httpPost)(path, ...middleware)(target, propertyKey, value);
            break;
        case "delete":
            (0, inversify_express_utils_1.httpDelete)(path, ...middleware)(target, propertyKey, value);
            break;
        case "put":
            (0, inversify_express_utils_1.httpPut)(path, ...middleware)(target, propertyKey, value);
            break;
        case "patch":
            (0, inversify_express_utils_1.httpPatch)(path, ...middleware)(target, propertyKey, value);
    }
};
const Get = (path, ...middleware) => (target, propertyKey, value) => decoratorFactory(path, "get", ...middleware)(target, propertyKey, value);
exports.Get = Get;
const Post = (path, ...middleware) => (target, propertyKey, value) => decoratorFactory(path, "post", ...middleware)(target, propertyKey, value);
exports.Post = Post;
const Put = (path, ...middleware) => (target, propertyKey, value) => decoratorFactory(path, "put", ...middleware)(target, propertyKey, value);
exports.Put = Put;
const Delete = (path, ...middleware) => (target, propertyKey, value) => decoratorFactory(path, "delete", ...middleware)(target, propertyKey, value);
exports.Delete = Delete;
const Patch = (path, ...middleware) => (target, propertyKey, value) => decoratorFactory(path, "patch", ...middleware)(target, propertyKey, value);
exports.Patch = Patch;
//# sourceMappingURL=decorators.js.map