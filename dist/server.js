"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("./controllers");
const core_1 = require("@mikro-orm/core");
const express_1 = __importDefault(require("express"));
const inversify_1 = require("inversify");
const inversify_binding_decorators_1 = require("inversify-binding-decorators");
const inversify_express_utils_1 = require("inversify-express-utils");
const types_1 = require("./types");
const inversify_2 = __importDefault(require("./config/inversify"));
const path = __importStar(require("path"));
class Server {
    app;
    server;
    constructor() {
        this.initContainer()
            .then(container => {
            this.server = new inversify_express_utils_1.InversifyExpressServer(container, null, {
                rootPath: "/api"
            });
            this.server.setConfig(app => {
                app.use(express_1.default.json());
                app.use((req, res, next) => {
                    const connection = container.get(types_1.DI_TYPES.DATABASE_CONNECTION);
                    core_1.RequestContext.create(connection.em, next);
                });
                if (process.env.NODE_ENV === "production") {
                    console.log("App is in production.");
                    app.use(express_1.default.static(path.resolve(__dirname, "public")));
                }
            });
            this.app = this.server.build();
            this.app.listen(process.env.SERVER_PORT, () => {
                console.log("App started on port " + process.env.SERVER_PORT);
            });
        })
            .catch(err => console.error(err));
    }
    initContainer = async () => {
        const container = new inversify_1.Container();
        await container.loadAsync(inversify_2.default);
        container.load((0, inversify_binding_decorators_1.buildProviderModule)());
        return container;
    };
}
exports.default = Server;
