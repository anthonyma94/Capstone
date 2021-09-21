import { LoadStrategy, NamingStrategy } from "@mikro-orm/core";
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
