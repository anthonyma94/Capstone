import { mapMutations, updateServer } from "@/store/services";
import { Module } from "vuex";
import { RootState, DefaultState } from "../../types";
import {
    GetterTypes,
    LoadingTypes,
    MutationTypes,
    ActionTypes
} from "../../types";
import { Store, StoreActionTypes, StoreGetterTypes } from "./types";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const store: Module<DefaultState<Store>, RootState> = {
    namespaced: true,
    state: {
        data: {
            id: "",
            name: "",
            storeHours: []
        },
        status: LoadingTypes.IDLE
    },
    mutations,
    actions,
    getters
};

export default store;
