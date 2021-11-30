import axios from "@/services/axios";
import {
    ActionTypes,
    GetterTypes,
    LoadingTypes,
    MutationTypes
} from "@/store/types";
import { computed } from "vue-demi";
import { Action, Module } from "vuex-module-decorators";
import BaseModule, { updateServer } from "../BaseModule";
import { JobTitle, JobTitleActionTypes, JobTitleGetterTypes } from "./types";

@Module({ namespaced: true, name: "jobTitle" })
export default class JobTitleModule extends BaseModule<JobTitle> {
    data: JobTitle[] = [];
    get [GetterTypes.GET_BY_ID]() {
        return (id: string) => computed(() => this.data.find(x => x.id === id));
    }

    [MutationTypes.REMOVE_DATA](data: JobTitle | JobTitle[]): void {}

    @Action
    async [ActionTypes.INITIALIZE_DATA]() {
        this.context.commit(MutationTypes.SET_STATUS, LoadingTypes.LOADING);
        const res = await axios.get("/jobtitle");
        this.context.commit(MutationTypes.SET_DATA, res.data);
        this.context.commit(MutationTypes.SET_STATUS, LoadingTypes.SUCCESS);
    }

    @Action
    async [JobTitleActionTypes.ADD_TITLE](title: string) {
        await updateServer(this.context.commit, async () => {
            const res = await axios.post("/jobtitle", { name: title });

            this.data.push(res.data);
        });
    }

    async [ActionTypes.UPDATE_DATA](payload?: any) {
        await updateServer(this.context.commit, async () => {
            const res = await axios.post("/jobtitle", { name: payload });
            this.context.commit(MutationTypes.SET_DATA, res.data);
        });
    }

    @Action
    async [ActionTypes.DELETE_DATA](id: string) {
        await updateServer(this.context.commit, async () => {
            await axios.delete(`/jobtitle/${id}`);
            const data = this.data.filter(x => x.id !== id);
            this.context.commit(MutationTypes.SET_DATA, data);
        });
    }
}
