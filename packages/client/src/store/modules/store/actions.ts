import axios from "@/services/axios";
import { updateServer } from "@/store/services";
import {
    ActionTypes,
    LoadingTypes,
    MutationTypes,
    RootState
} from "@/store/types";
import { ActionTree } from "vuex";
import { Store, StoreActionTypes, StoreState } from "./types";

const actions: ActionTree<StoreState, RootState> = {
    [ActionTypes.INITIALIZE_DATA]: async ({ commit }) => {
        commit(MutationTypes.SET_STATUS, LoadingTypes.LOADING);
        const res = await axios("/store");
        const data = res.data.map((item: Store) => {
            const storeHours = item.storeHours.map(i => {
                return {
                    ...i,
                    day: {
                        ...i.day,
                        start: i.day.start.replace(/:\d{2}$/g, ""),
                        end: i.day.end.replace(/:\d{2}$/g, "")
                    }
                };
            });
            return {
                ...item,
                storeHours
            };
        });
        commit(MutationTypes.SET_DATA, data[0]);
        commit(MutationTypes.SET_STATUS, LoadingTypes.SUCCESS);
    },
    [StoreActionTypes.CHANGE_NAME]: async (
        { commit },
        payload: { id: string; name: string }
    ) =>
        await updateServer(commit, {
            method: "PUT",
            url: `/store/changename/${payload.id}`,
            data: { name: payload.name }
        }),
    [StoreActionTypes.CREATE_STORE]: async ({ commit }, payload: string) =>
        await updateServer(commit, {
            method: "POST",
            url: "/store",
            data: { name: payload }
        }),
    [StoreActionTypes.CHANGE_HOURS]: async ({ commit }, payload) =>
        await updateServer(commit, {
            method: "PUT",
            url: `/store/changehours/${payload.storeId}`,
            data: payload.data
        })
};
export default actions;
