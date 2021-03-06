/**
 * Creates and starts the server.
 * DI is collected and injected here, as well as server-wide middleware like authentication.
 * Site is served statically here if in production.
 */
import "reflect-metadata";
import "./controllers";
import "./utils/dayjs";
import { Connection, IDatabaseDriver, RequestContext } from "@mikro-orm/core";
import { MikroORM } from "@mikro-orm/core/MikroORM";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import { Container } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { InversifyExpressServer } from "inversify-express-utils";
import { DI_TYPES } from "./types";
import bindings from "./config/inversify";
import * as path from "path";
import dayjs from "dayjs";
import customParse from "dayjs/plugin/customParseFormat";
import { authenticateToken } from "./utils/jwt";
import history from "connect-history-api-fallback";

export default class Server {
    protected app?: Application;
    protected server?: InversifyExpressServer;

    constructor() {
        dayjs.extend(customParse);
        this.initContainer()
            .then(container => {
                this.server = new InversifyExpressServer(container, null, {
                    rootPath: "/api"
                });
                this.server.setConfig(app => {
                    // Set config here
                    app.use(express.json());
                    app.use(cookieParser());
                    app.use((req, res, next) => {
                        const connection = container.get<
                            MikroORM<IDatabaseDriver<Connection>>
                        >(DI_TYPES.DATABASE_CONNECTION);
                        RequestContext.create(connection.em, next);
                    });

                    // Authentication middleware
                    app.use(authenticateToken);

                    // Serves content in production
                    if (process.env.NODE_ENV === "production") {
                        console.log("App is in production.");
                        app.use(history());
                        app.use(
                            express.static(path.resolve(__dirname, "public"))
                        );
                    }
                });
                this.app = this.server.build();
                this.app.listen(process.env.SERVER_PORT, () => {
                    console.log(
                        "App started on port " + process.env.SERVER_PORT
                    );
                });
            })
            .catch(err => console.error(err));
    }

    private initContainer = async (): Promise<Container> => {
        const container = new Container();
        await container.loadAsync(bindings);

        container.load(buildProviderModule());
        return container;
    };
}
