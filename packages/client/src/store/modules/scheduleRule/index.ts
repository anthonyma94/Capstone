import axios from "@/services/axios";
import { ActionTypes, GetterTypes, MutationTypes } from "@/store/types";
import { computed, ComputedRef } from "vue-demi";
import { Action, Module } from "vuex-module-decorators";
import BaseModule, { updateServer } from "../BaseModule";
import { ScheduleRule } from "./types";

@Module({ namespaced: true, name: "scheduleRule" })
export default class ScheduleRuleModule extends BaseModule<ScheduleRule> {
    data = {} as ScheduleRule[];

    get [GetterTypes.GET_BY_ID](): (
        id: string
    ) => ComputedRef<ScheduleRule | undefined> {
        return id => computed(() => this.data.find(x => x.id === id));
        // throw new Error("Method not implemented.");
    }

    [MutationTypes.REMOVE_DATA](data: ScheduleRule | ScheduleRule[]): void {
        throw new Error("Method not implemented.");
    }

    @Action
    async [ActionTypes.INITIALIZE_DATA]() {
        await updateServer(this.context.commit, {
            url: "/schedule/rules"
        });
    }

    [ActionTypes.UPDATE_DATA](payload?: any) {
        throw new Error("Method not implemented.");
    }

    [ActionTypes.DELETE_DATA](payload: any) {
        throw new Error("Method not implemented.");
    }
}
