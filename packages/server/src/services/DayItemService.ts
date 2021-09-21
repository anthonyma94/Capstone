import { provide } from "inversify-binding-decorators";
import DayItem from "../entities/DayItem";
import { InjectRepo } from "../utils/decorators";
import { BaseService } from "./BaseService";

@provide(DayItemService)
export default class DayItemService extends BaseService<DayItem> {
    constructor(@InjectRepo(DayItem) repo: any) {
        super(repo);
    }
}
