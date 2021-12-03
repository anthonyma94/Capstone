import axios from "@/services/axios";
import { ActionTypes, GetterTypes, MutationTypes } from "@/store/types";
import { computed, ComputedRef } from "vue-demi";
import { Action, Module, Mutation } from "vuex-module-decorators";
import BaseModule, { updateServer } from "../BaseModule";
import {
    Store,
    StoreActionTypes,
    StoreGetterTypes,
    StoreMutationTypes
} from "./types";
import dayjs, { Dayjs } from "dayjs";

@Module({ namespaced: true, name: "store" })
export default class StoreModule extends BaseModule<Store> {
    data = {} as Store;

    get [GetterTypes.GET_BY_ID](): (
        id: string
    ) => ComputedRef<Store | undefined> {
        return (id: string) => computed(() => undefined);
    }

    get [StoreGetterTypes.GET_STORE_HOURS]() {
        return computed(() => this.data.storeHours);
    }

    get [StoreGetterTypes.GET_SCHEDULE]() {
        return this.data.schedule?.data ?? [];
    }

    get SCHEDULE_IS_DEFAULT() {
        return computed(() => this.data.schedule?.default ?? false);
    }

    get GET_SCHEDULE_BY_DATE() {
        return (date: Dayjs) =>
            this.data.schedule?.data?.filter(x =>
                dayjs(x.start as string).isSame(date, "date")
            ) || [];
    }

    get SCHEDULE_START_DATES() {
        return async () => {
            const res = await axios.get("/schedule/startdates");
            return res.data.map((item: any) =>
                dayjs(item)
                    .add(12, "hours")
                    .toDate()
            );
        };
    }

    [MutationTypes.REMOVE_DATA](data: Store | Store[]): void {
        throw new Error("Method not implemented.");
    }

    @Mutation
    [StoreMutationTypes.SET_SCHEDULE](schedule: any) {
        this.data.schedule = schedule;
    }

    @Action
    async [StoreActionTypes.EDIT_SCHEDULE_ITEM](payload: {
        id: string;
        date: Date;
        start: string;
        end: string;
        personId?: string;
    }) {
        await updateServer(this.context.commit, async () => {
            await axios.put("/schedule/item", payload);
        });
        const index = this.data.schedule.data?.findIndex(
            x => x.id === payload.id
        );
        if (index !== undefined) {
            const item = this.data.schedule.data![index];
            const start = dayjs(payload.date);
            const end = dayjs(
                `${start.format("YYYY-MM-DD")} ${payload.end}`,
                "YYYY-MM-DD HH:mm"
            );
            this.data.schedule.data![index] = {
                ...item,
                start: start.toISOString(),
                end: end.toISOString(),
                title: `${start.format("hh:mm A")} - ${end.format("hh:mm A")}`
            };

            if (payload.personId) {
                this.data.schedule.data![index].resourceId = payload.personId;
            }
        }
    }

    @Action
    async ADD_SCHEDULE_ITEM(payload: {
        id: string;
        date: Dayjs;
        start: string;
        end: string;
        personId: string;
        scheduleId: string;
    }) {
        await updateServer(this.context.commit, async () => {
            const res = await axios.post("/schedule/item", payload);
            if (!this.data.schedule) {
                this.data.schedule = {
                    data: []
                };
            }
            if (this.data.schedule.data) {
                this.data.schedule.data.push(res.data);
            } else {
                this.data.schedule.data = [res.data];
            }
        });
    }

    @Action
    async DELETE_SCHEDULE_ITEM(id: string) {
        await updateServer(this.context.commit, async () => {
            await axios.delete("/schedule/item", {
                params: {
                    id
                }
            });
            this.data.schedule.data =
                this.data.schedule.data?.filter(x => x.id !== id) || [];
        });
    }

    @Action
    async SET_DEFAULT_SCHEDULE(date: Date) {
        await updateServer(this.context.commit, async () => {
            await axios.post("/schedule/default", {
                date
            });
            this.data.schedule.default = true;
        });
    }

    @Action
    async [StoreActionTypes.GENERATE_SCHEDULE](start: Date) {
        await updateServer(this.context.commit, async () => {
            await axios.post("/schedule", null, {
                params: {
                    start: start.toUTCString()
                }
            });
        });
    }

    @Action
    async [StoreActionTypes.UPDATE_SCHEDULE](start: Date) {
        await updateServer(this.context.commit, async () => {
            const resp = await axios.get("/schedule", {
                params: {
                    start: start.toISOString()
                }
            });
            if (resp.data) {
                this.context.commit(StoreMutationTypes.SET_SCHEDULE, resp.data);
            } else {
                this.context.commit(StoreMutationTypes.SET_SCHEDULE, {
                    data: [],
                    default: false
                });
            }
        });
    }

    @Action
    async [ActionTypes.INITIALIZE_DATA]() {
        await updateServer(this.context.commit, async () => {
            const res = await axios.get("/store");
            const data = res.data.map((item: Store) => {
                const storeHours = item.storeHours.map(i => {
                    return {
                        ...i,
                        day: {
                            ...i.day,
                            start: i.day.start,
                            end: i.day.end
                        }
                    };
                });
                return {
                    ...item,
                    storeHours
                };
            });
            this.context.commit(MutationTypes.SET_DATA, data[0]);
        });
        const today = new Date();
        const dayOfWeek = today.getDay();
        const sunday = new Date();
        if (dayOfWeek !== 0) {
            sunday.setDate(sunday.getDate() - dayOfWeek);
        }
        this.context.dispatch(StoreActionTypes.UPDATE_SCHEDULE, sunday);
    }

    [ActionTypes.UPDATE_DATA](payload?: any) {
        throw new Error("Method not implemented.");
    }

    [ActionTypes.DELETE_DATA](payload: any) {
        throw new Error("Method not implemented.");
    }

    @Action
    async [StoreActionTypes.CHANGE_NAME](payload: {
        id: string;
        name: string;
    }) {
        await updateServer(this.context.commit, {
            method: "PUT",
            url: `/store/changename/${payload.id}`,
            data: { name: payload.name }
        });
    }

    @Action
    async [StoreActionTypes.CREATE_STORE](payload: string) {
        await updateServer(this.context.commit, {
            method: "POST",
            url: "/store",
            data: { name: payload }
        });
    }

    @Action
    async [StoreActionTypes.CHANGE_HOURS](payload: {
        id: string;
        data: { id?: string; start: Dayjs; end: Dayjs }[];
    }) {
        await updateServer(this.context.commit, async () => {
            const res = await axios.put(
                `/store/changehours/${payload.id}`,
                payload.data
            );

            this.data.storeHours = res.data;
        });
    }
}
