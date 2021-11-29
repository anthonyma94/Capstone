import { DefaultState, LoadingTypes } from "@/store/types";
import { DayItem } from "../dayItem";
import { EventInput } from "@fullcalendar/core";
export enum StoreActionTypes {
    CREATE_STORE = "CREATE_STORE",
    CHANGE_HOURS = "CHANGE_HOURS",
    CHANGE_NAME = "CHANGE_NAME",
    EDIT_SCHEDULE_ITEM = "EDIT_SCHEDULE_ITEM",
    UPDATE_SCHEDULE = "UPDATE_SCHEDULE",
    GENERATE_SCHEDULE = "GENERATE_SCHEDULE"
}

export enum StoreGetterTypes {
    GET_STORE_HOURS = "GET_STORE_HOURS",
    GET_SCHEDULE = "GET_SCHEDULE"
}

export enum StoreMutationTypes {
    SET_SCHEDULE = "SET_SCHEDULE"
}

export interface Store {
    id: string;
    name: string;
    storeHours: {
        id: string;
        day: DayItem;
    }[];
    schedule: { default?: boolean; data?: EventInput[] };
}

export interface StoreState extends DefaultState<Store> {}
