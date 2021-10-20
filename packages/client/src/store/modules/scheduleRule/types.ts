import { DefaultState } from "@/store/types";
import { DayItem } from "../dayItem";
import { JobTitle } from "../jobTitle/types";
// export enum StoreActionTypes {
//     CREATE_STORE = "CREATE_STORE",
//     CHANGE_HOURS = "CHANGE_HOURS",
//     CHANGE_NAME = "CHANGE_NAME"
// }

// export enum StoreGetterTypes {
//     GET_STORE_HOURS = "GET_STORE_HOURS"
// }

export interface ScheduleRule {
    id: string;
    day: DayItem;
    rules: Array<ScheduleRule>;
}

export interface ScheduleRule {
    id: string;
    jobTitle: JobTitle;
    amount: number;
}

export interface ScheduleRuleState extends DefaultState<ScheduleRule> {}
