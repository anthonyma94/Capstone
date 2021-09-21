import { provide } from "inversify-binding-decorators";
import StoreHour from "../entities/StoreHour";
import { InjectRepo } from "../utils/decorators";
import { BaseService } from "./BaseService";

@provide(StoreHourService)
export default class StoreHourService extends BaseService<StoreHour> {
    constructor(@InjectRepo(StoreHour) repo: any) {
        super(repo);
    }
}
