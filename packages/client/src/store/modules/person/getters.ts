import { GetterTypes, RootState } from "@/store/types";
import { GetterTree } from "vuex";
import { PersonState } from "./types";

const getters: GetterTree<PersonState, RootState> = {
    [GetterTypes.GET_ALL]: state => state.data,
    [GetterTypes.GET_STATUS]: state => state.status,
    [GetterTypes.GET_BY_ID]: state => (id: string) =>
        state.data.find(i => i.id === id)
};

export default getters;
