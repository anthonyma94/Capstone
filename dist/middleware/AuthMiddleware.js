"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AuthMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_binding_decorators_1 = require("inversify-binding-decorators");
const inversify_express_utils_1 = require("inversify-express-utils");
const jwt_1 = require("../utils/jwt");
let AuthMiddleware = AuthMiddleware_1 = class AuthMiddleware extends inversify_express_utils_1.BaseMiddleware {
    handler(req, res, next) {
        (0, jwt_1.authorizeAdmin)(req, res, next);
    }
};
AuthMiddleware = AuthMiddleware_1 = __decorate([
    (0, inversify_binding_decorators_1.provide)(AuthMiddleware_1)
], AuthMiddleware);
exports.default = AuthMiddleware;
//# sourceMappingURL=AuthMiddleware.js.map