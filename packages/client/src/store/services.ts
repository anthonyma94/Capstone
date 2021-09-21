import axios from "@/services/axios";
import { AxiosRequestConfig } from "axios";
import { Commit } from "vuex";
import { DefaultState, LoadingTypes, MutationTypes } from "./types";

export async function updateServer(
    commit: Commit,
    config: AxiosRequestConfig,
    dataKey?: string | number
) {
    commit(MutationTypes.SET_STATUS, LoadingTypes.LOADING);
    const actionType =
        config.method?.toUpperCase() !== "DELETE"
            ? MutationTypes.SET_DATA
            : MutationTypes.REMOVE_DATA;
    const res = await axios(config);
    if (!(dataKey === undefined || dataKey === "")) {
        commit(actionType, res.data[dataKey]);
    } else {
        commit(actionType, res.data);
    }

    commit(MutationTypes.SET_STATUS, LoadingTypes.SUCCESS);
}

export function mapMutations() {
    return {
        [MutationTypes.SET_DATA](state: any, payload: any) {
            if (Array.isArray(state.data) && !Array.isArray(payload)) {
                state.data.push(payload);
            } else {
                state.data = payload;
            }
        },
        [MutationTypes.SET_STATUS](state: any, payload: any) {
            state.status = payload;
        },
        [MutationTypes.REMOVE_DATA](state: any, payload: any) {
            if (Array.isArray(state.data) && !Array.isArray(payload)) {
                state.data = (state.data as any[]).filter(
                    i => i.id !== payload.id
                );
            }
        }
    };
}
