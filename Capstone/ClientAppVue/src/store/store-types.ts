export enum MutationTypes {
    SET_DATA = "SET_DATA",
    SET_STATUS = "SET_STATUS"
}

export enum ActionTypes {
    INITIALIZE_DATA = "INITIALIZE_DATA",
    UPDATE_DATA = "UPDATE_DATA"
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

export interface Status {
    type: "good" | "warning" | "danger";
    value: string | number;
    text?: string;
}
