import { useStore as useVueStore } from "@/store";
import { ActionTypes, GetterTypes, LoadingTypes } from "@/store/types";
import { Store, StoreActionTypes } from "./types";
import storeModule from "../store";
export default function useStore() {
    const store = useVueStore();
    const storeKey = "store/";

    return {
        [ActionTypes.INITIALIZE_DATA]: (): Promise<void> =>
            store.dispatch(storeKey + ActionTypes.INITIALIZE_DATA),
        [StoreActionTypes.CREATE_STORE]: (name: string): Promise<void> =>
            store.dispatch(storeKey + StoreActionTypes.CREATE_STORE, name),
        [StoreActionTypes.CHANGE_NAME]: (data: {
            id: string;
            name: string;
        }): Promise<void> =>
            store.dispatch(storeKey + StoreActionTypes.CHANGE_NAME, data),
        [StoreActionTypes.CHANGE_HOURS]: (data: {
            storeId: string;
            data: { id?: string; start: string; end: string }[];
        }): Promise<void> =>
            store.dispatch(storeKey + StoreActionTypes.CHANGE_HOURS, data),
        [GetterTypes.GET_ALL]: () =>
            store.getters[storeKey + GetterTypes.GET_ALL] as Store,
        [GetterTypes.GET_STATUS]: () =>
            store.getters[storeKey + GetterTypes.GET_STATUS] as LoadingTypes
    };
}
