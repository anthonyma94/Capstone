import { AuthState } from "./modules/auth/types";
import { JobTitleState } from "./modules/jobTitle/types";
import { PersonState } from "./modules/person/types";
import { RequestState } from "./modules/request/types";
import { ScheduleRuleState } from "./modules/scheduleRule/types";
import { StoreState } from "./modules/store/types";

export enum MutationTypes {
    SET_DATA = "MUTATE_SET_DATA",
    UPDATE_DATA = "MUTATE_UPDATE_DATA",
    SET_STATUS = "MUTATE_SET_STATUS",
    REMOVE_DATA = "MUTATE_REMOVE_DATA"
}

export enum ActionTypes {
    INITIALIZE_DATA = "INITIALIZE_DATA",
    UPDATE_DATA = "UPDATE_DATA",
    DELETE_DATA = "DELETE_DATA"
}

export enum GetterTypes {
    GET_ALL = "GET_ALL",
    GET_BY_ID = "GET_BY_ID",
    GET_STATUS = "GET_STATUS"
}

export enum LoadingTypes {
    LOADING = "LOADING",
    SUCCESS = "SUCCESS",
    IDLE = "IDLE"
}

export interface DefaultState<T> {
    data: T;
    status: LoadingTypes;
}

export interface RootState {
    person: PersonState;
    store: StoreState;
    jobTitle: JobTitleState;
    scheduleRule: ScheduleRuleState;
    auth: AuthState;
    request: RequestState;
}
