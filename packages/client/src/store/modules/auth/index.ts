import { GetterTypes, MutationTypes, ActionTypes } from "@/store/types";
import { computed, ComputedRef } from "vue-demi";
import { Action, Module, Mutation } from "vuex-module-decorators";
import BaseModule, { updateServer } from "../BaseModule";
import { Auth } from "./types";

@Module({ namespaced: true, name: "auth" })
export default class AuthModule extends BaseModule<Auth> {
    data: Auth = {};

    get [GetterTypes.GET_BY_ID](): (
        id: string
    ) => ComputedRef<Auth | undefined> {
        return id => computed(() => undefined);
    }

    get ROLE() {
        return this.data?.role;
    }

    get USER() {
        if (this.data.user && this.data.user !== "admin") {
            const user = this.context.rootGetters["person/GET_BY_ID"](
                this.data.user
            ).value;
            return user.firstName + " " + user.lastName;
        } else if (this.data.user === "admin") {
            return "Admin";
        } else return "";
    }

    get USER_ID() {
        return this.data?.user ?? "";
    }

    get IS_ADMIN() {
        return this.data?.role === "admin";
    }

    @Mutation
    [MutationTypes.UPDATE_DATA](payload: any) {
        this.data = payload;
    }

    [MutationTypes.REMOVE_DATA](data: Auth | Auth[]): void {}

    @Action
    async [ActionTypes.INITIALIZE_DATA]() {
        await updateServer(this.context.commit, {
            method: "get",
            url: "/auth"
        });
    }

    @Action
    [ActionTypes.UPDATE_DATA](payload?: any) {
        this.context.commit(MutationTypes.UPDATE_DATA, payload);
    }

    [ActionTypes.DELETE_DATA](payload: any) {}
}
