import { DefaultState, LoadingTypes } from "@/store/types";
import { DayItem } from "../dayItem";
export enum StoreActionTypes {
    CREATE_STORE = "CREATE_STORE",
    CHANGE_HOURS = "CHANGE_HOURS",
    CHANGE_NAME = "CHANGE_NAME"
}

export enum StoreGetterTypes {
    GET_STORE_HOURS = "GET_STORE_HOURS"
}

export interface Store {
    id: string;
    name: string;
    storeHours: {
        id: string;
        day: DayItem;
    }[];
}

export interface StoreState extends DefaultState<Store> {}
