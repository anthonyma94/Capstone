import axios from "@/services/axios";
import { mapMutations } from "@/store/services";
import { Module } from "vuex";
import {
    ActionTypes,
    DefaultState,
    GetterTypes,
    LoadingTypes,
    MutationTypes,
    RootState
} from "../../types";
import { Person } from "./types";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const person: Module<DefaultState<Person[]>, RootState> = {
    namespaced: true,
    state: {
        data: [],
        status: LoadingTypes.IDLE
    },
    mutations,
    actions,
    getters
};

export default person;
