import axios from "@/services/axios";
import { ActionTypes, GetterTypes, MutationTypes } from "@/store/types";
import { computed, ComputedRef } from "vue-demi";
import { Action, Module } from "vuex-module-decorators";
import BaseModule, { updateServer } from "../BaseModule";
import { ScheduleRule } from "./types";
import { Dayjs } from "dayjs";

@Module({ namespaced: true, name: "scheduleRule" })
export default class ScheduleRuleModule extends BaseModule<ScheduleRule> {
    data = [] as ScheduleRule[];

    get [GetterTypes.GET_BY_ID](): (
        id: string
    ) => ComputedRef<ScheduleRule | undefined> {
        return id => computed(() => this.data.find(x => x.id === id));
        // throw new Error("Method not implemented.");
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
        type: "recurring";
        days: number[];
        start: Date;
        end: Date;
        employees: { jobId: string; amount: number }[];
    }) {
        await updateServer(this.context.commit, async () => {
            const res = await axios.post("/schedule/rules", params);

            this.data.push(res.data);
        });
    }

    [ActionTypes.UPDATE_DATA](payload?: any) {}

    [ActionTypes.DELETE_DATA](payload: any) {}
}
