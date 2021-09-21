import { GetterTypes, RootState } from "@/store/types";
import { GetterTree } from "vuex";
import { StoreGetterTypes, StoreState } from "./types";

const getters: GetterTree<StoreState, RootState> = {
    [GetterTypes.GET_ALL]: state => state.data,
    [GetterTypes.GET_STATUS]: state => state.status,
    [StoreGetterTypes.GET_STORE_HOURS]: state => state.data.storeHours
};
export default getters;
