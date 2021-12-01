"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseClient = void 0;
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
class DatabaseClient {
    connect = async () => {
        try {
            return core_1.MikroORM.init(mikro_orm_config_1.default);
        }
        catch (err) {
            console.error(err);
        }
    };
}
exports.DatabaseClient = DatabaseClient;
//# sourceMappingURL=database.js.map