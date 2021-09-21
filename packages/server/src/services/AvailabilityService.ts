import { provide } from "inversify-binding-decorators";
import Availability from "../entities/Availability";
import { InjectRepo } from "../utils/decorators";
import { BaseService } from "./BaseService";

@provide(AvailabilityService)
export default class AvailabilityService extends BaseService<Availability> {
    constructor(@InjectRepo(Availability) repo: any) {
        super(repo);
    }
}
