import axios from "@/services/axios";
import {
    ActionTypes,
    GetterTypes,
    LoadingTypes,
    MutationTypes
} from "@/store/types";
import { computed, ComputedRef } from "vue-demi";
import { Action, Module } from "vuex-module-decorators";
import BaseModule, { updateServer } from "../BaseModule";
import { JobTitle, JobTitleActionTypes, JobTitleGetterTypes } from "./types";

@Module({ namespaced: true, name: "jobTitle" })
export default class JobTitleModule extends BaseModule<JobTitle> {
    data: JobTitle[] = [];
    get [GetterTypes.GET_BY_ID]() {
        return (id: string) => computed(() => this.data.find(x => x.id === id));
    }

    get [JobTitleGetterTypes.GET_ALL_WITH_PEOPLE_AMOUNT]() {
        return this.data.map(item => {
            return {
                ...item,
                numOfEmps: this.context.rootState.person.data.filter(
                    person => person.jobTitle.id === item.id
                ).length
            };
        });
    }

    [MutationTypes.REMOVE_DATA](data: JobTitle | JobTitle[]): void {
        throw new Error("Method not implemented.");
    }

    @Action
    async [ActionTypes.INITIALIZE_DATA]() {
        this.context.commit(MutationTypes.SET_STATUS, LoadingTypes.LOADING);
        const res = await axios.get("/jobtitle");
        this.context.commit(MutationTypes.SET_DATA, res.data);
        this.context.commit(MutationTypes.SET_STATUS, LoadingTypes.SUCCESS);
    }

    async [JobTitleActionTypes.ADD_TITLE](payload: string) {}

    async [ActionTypes.UPDATE_DATA](payload?: any) {
        await updateServer(this.context.commit, async () => {
            const res = await axios.post("/jobtitle", { name: payload });
            this.context.commit(MutationTypes.SET_DATA, res.data);
        });
    }
    [ActionTypes.DELETE_DATA](payload: any) {
        throw new Error("Method not implemented.");
    }

    // [ActionTypes.INITIALIZE_DATA]: async ({ commit }) =>
    //     await updateServer(commit, { method: "get", url: "/jobtitle" }),
    // [ActionTypes.DELETE_DATA]: async ({ commit }, id: string) =>
    //     await updateServer(commit, {
    //         method: "DELETE",
    //         url: `/jobtitle/${id}`
    //     }),
    // [JobTitleActionTypes.ADD_TITLE]: async ({ commit }, payload: string) =>
    //     await updateServer(commit, {
    //         method: "post",
    //         url: "/jobtitle",
    //         data: { name: payload }
    //     })
}
