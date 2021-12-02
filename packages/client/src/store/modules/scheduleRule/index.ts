import axios from "@/services/axios";
import { ActionTypes, GetterTypes, MutationTypes } from "@/store/types";
import { computed, ComputedRef } from "vue-demi";
import { Action, Module } from "vuex-module-decorators";
import BaseModule, { updateServer } from "../BaseModule";
import { ScheduleRule } from "./types";

@Module({ namespaced: true, name: "scheduleRule" })
export default class ScheduleRuleModule extends BaseModule<ScheduleRule> {
    data = [] as ScheduleRule[];

    get [GetterTypes.GET_BY_ID](): (
        id: string
    ) => ComputedRef<ScheduleRule | undefined> {
        return id => computed(() => this.data.find(x => x.id === id));
    }

    get GET_BY_DAY() {
        return (day: number) =>
            computed(() => this.data.filter(x => x.day.day === day) || []);
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

    @Action
    async ADD_SCHEDULE_RULE(params: {
        id?: string;
        days: number[];
        date?: Date;
        start: Date;
        end: Date;
        employees: { jobId: string; amount: number; id?: string }[];
    }) {
        await updateServer(this.context.commit, async () => {
            const res = await axios.post("/schedule/rules", params);

            if (params.id) {
                const index = this.data.findIndex(x => x.id === params.id);
                const resIndex = res.data.findIndex(
                    (x: any) => x.id === params.id
                );
                const original = res.data.splice(resIndex, 1);
                this.data[index] = original[0];
            }
            this.data.push(...res.data);
        });
    }

    @Action
    async DELETE_SCHEDULE_RULE(id: string) {
        await updateServer(this.context.commit, async () => {
            const res = await axios.delete(`/schedule/rules/${id}`);

            if (res.status < 300) {
                this.context.commit(
                    MutationTypes.SET_DATA,
                    this.data.filter(x => x.id !== id)
                );
            }
        });
    }

    [ActionTypes.UPDATE_DATA](payload?: any) {}

    [ActionTypes.DELETE_DATA](payload: any) {}
}
