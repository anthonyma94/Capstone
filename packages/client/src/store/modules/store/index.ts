import axios from "@/services/axios";
import { ActionTypes, GetterTypes, MutationTypes } from "@/store/types";
import { ComputedRef } from "vue-demi";
import { Action, Module } from "vuex-module-decorators";
import BaseModule, { updateServer } from "../BaseModule";
import { Store, StoreActionTypes, StoreGetterTypes } from "./types";

@Module({ namespaced: true, name: "store" })
export default class StoreModule extends BaseModule<Store> {
    data = {} as Store;

    get [GetterTypes.GET_BY_ID](): (
        id: string
    ) => ComputedRef<Store | undefined> {
        throw new Error("Method not implemented.");
    }

    get [StoreGetterTypes.GET_STORE_HOURS]() {
        return this.data.storeHours;
    }

    [MutationTypes.REMOVE_DATA](data: Store | Store[]): void {
        throw new Error("Method not implemented.");
    }

    @Action
    async [ActionTypes.INITIALIZE_DATA]() {
        // console.log("here");
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
        // this.context.commit(MutationTypes.SET_STATUS)
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
        data: { id?: string; start: string; end: string }[];
    }) {
        await updateServer(this.context.commit, {
            method: "PUT",
            url: `/store/changehours/${payload.id}`,
            data: payload.data
        });
    }
}
