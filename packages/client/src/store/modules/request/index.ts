import axios from "@/services/axios";
import { ActionTypes, GetterTypes, MutationTypes } from "@/store/types";
import { computed, ComputedRef } from "vue-demi";
import { Action, Module } from "vuex-module-decorators";
import BaseModule, { updateServer } from "../BaseModule";
import dayjs, { Dayjs } from "dayjs";
import { Request, TimeOff } from "./types";

@Module({ namespaced: true, name: "request" })
export default class RequestModule extends BaseModule<Request> {
    data: Request = {
        timeoff: []
    };
    get [GetterTypes.GET_BY_ID](): (
        id: string
    ) => ComputedRef<Request | undefined> {
        return id => computed(() => undefined);
    }

    get ALL_TIMEOFFS() {
        return this.data.timeoff;
    }

    get TIMEOFF_BY_PERSON(): (id: string) => ComputedRef<TimeOff[]> {
        return id =>
            computed(() => this.data.timeoff.filter(x => x.person === id));
    }

    get TIMEOFF_BY_ID() {
        return (id: string) => this.data.timeoff.find(x => x.id === id)!;
    }

    get REQUEST_IS_PENDING() {
        return (id: string) => {
            const item = this.TIMEOFF_BY_ID(id);
            return item.isApproved === null || item.isApproved === undefined;
        };
    }

    [MutationTypes.REMOVE_DATA](data: Request | Request[]): void {
        throw new Error("Method not implemented.");
    }

    @Action
    async [ActionTypes.INITIALIZE_DATA]() {
        await updateServer(this.context.commit, async () => {
            const res = await axios.get("/request/timeoff");

            this.data.timeoff = res.data ?? [];
        });
    }

    @Action
    async SUBMIT_TIMEOFF(params: { start: Date; end: Date; reason: string }) {
        await updateServer(this.context.commit, async () => {
            const res = await axios.post("/request/timeoff", params);

            if (res.data) {
                this.data.timeoff.push(res.data);
            }
        });
    }

    @Action
    async APPROVE_TIMEOFF(params: { id: string; action: "approve" | "deny" }) {
        await updateServer(this.context.commit, async () => {
            await axios.put("/request/timeoff/approve", params);

            const index = this.data.timeoff.findIndex(x => x.id === params.id);
            this.data.timeoff[index] = {
                ...this.data.timeoff[index],
                isApproved: params.action === "approve"
            };
        });
    }

    [ActionTypes.UPDATE_DATA](payload?: any) {}
    [ActionTypes.DELETE_DATA](payload: any) {}
}
