import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";
import jobTitle from "./modules/jobTitle";
import person from "./modules/person";
import storeModule from "./modules/store";
import scheduleRule from "./modules/scheduleRule";
import request from "./modules/request";
import auth from "./modules/auth";
import { RootState } from "./types";

export const key: InjectionKey<Store<RootState>> = Symbol();

export default createStore<RootState>({
    modules: {
        person,
        store: storeModule,
        jobTitle,
        scheduleRule,
        auth,
        request
    }
});

export function useStore() {
    return baseUseStore(key);
}
