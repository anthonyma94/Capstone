import { EntityRepository } from "@mikro-orm/core/entity/EntityRepository";
import { provide } from "inversify-binding-decorators";
import Schedule from "../entities/Schedule";
import ScheduleRule from "../entities/ScheduleRule";
import { InjectRepo } from "../utils/decorators";
import { BaseService } from "./BaseService";

@provide(ScheduleService)
export default class ScheduleService extends BaseService<Schedule> {
    constructor(
        @InjectRepo(Schedule) repo: any,
        @InjectRepo(ScheduleRule)
        private scheduleRuleRepo: EntityRepository<ScheduleRule>
    ) {
        super(repo);
    }

    public getRules = async () => {
        const res = await this.scheduleRuleRepo.findAll({
            populate: {
                day: true,
                rules: {
                    jobTitle: true
                }
            }
        });
        return res;
    };
}
