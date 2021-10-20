import axios from "@/services/axios";
import { AxiosRequestConfig } from "axios";
import { computed, ComputedRef } from "vue-demi";
import { Commit } from "vuex";
import { Mutation, VuexModule } from "vuex-module-decorators";
import {
    ActionTypes,
    GetterTypes,
    LoadingTypes,
    MutationTypes,
    RootState
} from "../types";

// export interface ModuleDefinitions<T> {
//     status: LoadingTypes;
//     data: T | T[];

//     readonly [GetterTypes.GET_STATUS]: ComputedRef<this["status"]>;
//     readonly [GetterTypes.GET_ALL]: ComputedRef<this["data"]>;
//     readonly [GetterTypes.GET_BY_ID]: (id: any) => ComputedRef<T | undefined>;

//     [MutationTypes.SET_STATUS]: (status: this["status"]) => void;
//     [MutationTypes.SET_DATA]: (data: this["data"]) => void;
//     [MutationTypes.REMOVE_DATA]: (data: this["data"]) => void;

//     [ActionTypes.INITIALIZE_DATA]: () => any;
//     [ActionTypes.UPDATE_DATA]: (payload?: any) => any;
//     [ActionTypes.DELETE_DATA]: (payload: any) => any;
// }

export default abstract class BaseModule<T> extends VuexModule<
    ThisType<T>,
    RootState
> {
    status = LoadingTypes.IDLE;
    abstract data: T | T[];

    get [GetterTypes.GET_STATUS]() {
        return computed(() => this.status);
    }

    get [GetterTypes.GET_ALL](): ComputedRef<this["data"]> {
        return computed(() => this.data);
    }
    abstract get [GetterTypes.GET_BY_ID](): (
        id: string
    ) => ComputedRef<T | undefined>;

    @Mutation
    [MutationTypes.SET_STATUS](status: LoadingTypes) {
        this.status = status;
    }

    @Mutation
    [MutationTypes.SET_DATA](data: T | T[]) {
        this.data = data;
    }

    abstract [MutationTypes.REMOVE_DATA](data: T | T[]): void;
    abstract [ActionTypes.INITIALIZE_DATA](): any;
    abstract [ActionTypes.UPDATE_DATA](payload?: any): any;
    abstract [ActionTypes.DELETE_DATA](payload: any): any;
}

export async function updateServer(
    commit: Commit,
    params: (() => any) | AxiosRequestConfig
) {
    commit(MutationTypes.SET_STATUS, LoadingTypes.LOADING);
    if (typeof params === "function") {
        await params();
    } else {
        const res = await axios(params);
        commit(MutationTypes.SET_DATA, res.data);
    }
    commit(MutationTypes.SET_STATUS, LoadingTypes.SUCCESS);
}
