/**
 * Config object for DB connection.
 */

import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";

// Config
import mikroOrmConfig from "./mikro-orm.config";

export class DatabaseClient {
    public connect = async (): Promise<MikroORM<
        IDatabaseDriver<Connection>
    > | void> => {
        try {
            return MikroORM.init(mikroOrmConfig);
        } catch (err) {
            console.error(err);
        }
    };
}
