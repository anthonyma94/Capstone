import "reflect-metadata";
import { Container } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import bindings from "./config/inversify";
import Scheduler from "./utils/scheduler";

const initContainer = async (): Promise<Container> => {
    const container = new Container();
    await container.loadAsync(bindings);

    container.load(buildProviderModule());
    return container;
};

(async function() {
    const container = await initContainer();

    const scheduler = container.get<Scheduler>(Scheduler);
    await scheduler.schedule();
})();
