import { provide } from "inversify-binding-decorators";
import { JobTitle } from "../entities/JobTitle";
import { InjectRepo } from "../utils/decorators";
import { BaseService } from "./BaseService";

@provide(JobTitleService)
export default class JobTitleService extends BaseService<JobTitle> {
    constructor(@InjectRepo(JobTitle) repo: any) {
        super(repo);
    }
}
