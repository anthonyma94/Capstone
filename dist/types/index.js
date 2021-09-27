"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DI_TYPES = void 0;
var InversifyEnum;
(function (InversifyEnum) {
    InversifyEnum["DATABASE_CONNECTION"] = "DATABASE_CONNECTION";
    InversifyEnum["REPOSITORY"] = "REPOSITORY";
})(InversifyEnum || (InversifyEnum = {}));
const mapEnumToTypes = (typeEnum) => {
    const typesObject = {};
    Object.keys(typeEnum).forEach((key) => {
        typesObject[key] = Symbol.for(key);
    });
    return typesObject;
};
exports.DI_TYPES = mapEnumToTypes(InversifyEnum);
