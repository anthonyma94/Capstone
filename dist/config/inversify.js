"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const database_1 = require("./database");
const types_1 = require("../types");
const bindEntityToRepository = (bind, binding, connection, entity) => {
    bind(binding)
        .toDynamicValue(() => {
        return connection.em.getRepository(entity);
    })
        .inRequestScope();
};
const bindings = new inversify_1.AsyncContainerModule(async (bind) => {
    const databaseClient = new database_1.DatabaseClient();
    const connection = await databaseClient.connect();
    if (connection) {
        bind(types_1.DI_TYPES.DATABASE_CONNECTION).toConstantValue(connection);
        const metadata = Reflect.getOwnMetadata(types_1.DI_TYPES.REPOSITORY, Reflect);
        metadata.forEach((item) => {
            bindEntityToRepository(bind, Symbol.for(item.name), connection, item);
        });
    }
});
exports.default = bindings;
