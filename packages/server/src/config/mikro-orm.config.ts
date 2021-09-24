import {
    EntityProperty,
    LoadStrategy,
    NamingStrategy,
    Platform,
    Type,
    ValidationError,
    TimeType as DefaultTime
} from "@mikro-orm/core";
import { Connection } from "@mikro-orm/core/connections/Connection";
import { IDatabaseDriver } from "@mikro-orm/core/drivers/IDatabaseDriver";
import { Configuration, Options } from "@mikro-orm/core/utils/Configuration";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

export default {
    entities: ["./dist/entities"],
    entitiesTs: ["./src/entities"],
    baseDir: process.cwd(),
    type: "mariadb",
    user: process.env.MIKRO_ORM_USER,
    password: process.env.MIKRO_ORM_PASSWORD,
    host: process.env.MIKRO_ORM_HOST,
    port: process.env.MIKRO_ORM_PORT,
    dbName: process.env.MIKRO_ORM_DB_NAME,
    metadataProvider: TsMorphMetadataProvider
} as Options<IDatabaseDriver<Connection>>;

export class TimeType extends Type {
    convertToDatabaseValue(value: string, platform: Platform): string {
        const regex = new RegExp(/^\d{1,2}:\d{1,2}(:\d{1,2})?$/g);
        const match = regex.exec(value);
        if (match) {
            // No seconds
            if (match[1] === undefined) {
                value += ":00";
            }
            return value;
        } else {
            throw new ValidationError(`${value} is not a valid time.`);
        }
    }
    convertToJSValue(value: string, platform: Platform) {
        return value.replace(/:\d{1,2}$/g, "");
    }
    getColumnType() {
        return "time";
    }
}
