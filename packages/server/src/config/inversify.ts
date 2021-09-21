// Packages
import { AsyncContainerModule, interfaces } from "inversify";
import {
    Connection,
    GetRepository,
    IDatabaseDriver,
    MikroORM,
    EntityRepository
} from "@mikro-orm/core";

// Clients
import { DatabaseClient } from "./database";

// Inversify Types
import { DI_TYPES } from "../types";

const bindEntityToRepository = <T, U>(
    bind: interfaces.Bind,
    binding: symbol,
    connection: MikroORM<IDatabaseDriver<Connection>>,
    entity: { new (...args: string[] & U): T }
): void => {
    bind<GetRepository<T, EntityRepository<T>>>(binding)
        .toDynamicValue(
            (): GetRepository<T, EntityRepository<T>> => {
                return connection.em.getRepository<T>(entity);
            }
        )
        .inRequestScope();
};

const bindings = new AsyncContainerModule(
    async (bind): Promise<void> => {
        // Initialize Database Client Connection
        const databaseClient: DatabaseClient = new DatabaseClient();
        const connection = await databaseClient.connect();
        if (connection) {
            // Run Migrations
            // await connection.getMigrator().up();

            // Connection Bindings
            bind<MikroORM<IDatabaseDriver<Connection>>>(
                DI_TYPES.DATABASE_CONNECTION
            ).toConstantValue(connection);

            const metadata = Reflect.getOwnMetadata(
                DI_TYPES.REPOSITORY,
                Reflect
            );

            metadata.forEach((item: any) => {
                bindEntityToRepository(
                    bind,
                    Symbol.for(item.name),
                    connection,
                    item
                );
            });
        }
    }
);

export default bindings;
