import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
export declare class DatabaseClient {
    connect: () => Promise<MikroORM<IDatabaseDriver<Connection>> | void>;
}
