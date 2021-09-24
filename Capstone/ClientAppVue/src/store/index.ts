import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";
import person, { PersonState } from "./modules/person";

export interface RootState {
    person: PersonState;
}

export const key: InjectionKey<Store<RootState>> = Symbol();

export default createStore<RootState>({
    modules: { person }
});

export function useStore() {
    return baseUseStore(key);
}
