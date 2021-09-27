"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeType = void 0;
const core_1 = require("@mikro-orm/core");
const reflection_1 = require("@mikro-orm/reflection");
exports.default = {
    entities: ["./dist/entities"],
    entitiesTs: ["./src/entities"],
    baseDir: process.cwd(),
    type: "mariadb",
    user: process.env.MIKRO_ORM_USER,
    password: process.env.MIKRO_ORM_PASSWORD,
    host: process.env.MIKRO_ORM_HOST,
    port: process.env.MIKRO_ORM_PORT,
    dbName: process.env.MIKRO_ORM_DB_NAME,
    metadataProvider: reflection_1.TsMorphMetadataProvider
};
class TimeType extends core_1.Type {
    convertToDatabaseValue(value, platform) {
        const regex = new RegExp(/^\d{1,2}:\d{1,2}(:\d{1,2})?$/g);
        const match = regex.exec(value);
        if (match) {
            if (match[1] === undefined) {
                value += ":00";
            }
            return value;
        }
        else {
            throw new core_1.ValidationError(`${value} is not a valid time.`);
        }
    }
    convertToJSValue(value, platform) {
        return value.replace(/:\d{1,2}$/g, "");
    }
    getColumnType() {
        return "time";
    }
}
exports.TimeType = TimeType;
