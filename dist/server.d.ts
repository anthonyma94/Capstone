import "reflect-metadata";
import "./controllers";
import { Application } from "express";
import { InversifyExpressServer } from "inversify-express-utils";
export default class Server {
    protected app?: Application;
    protected server?: InversifyExpressServer;
    constructor();
    private initContainer;
}
