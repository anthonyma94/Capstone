import { mapMutations, updateServer } from "@/store/services";
import {
    ActionTypes,
    DefaultState,
    GetterTypes,
    LoadingTypes,
    MutationTypes,
    RootState
} from "@/store/types";
import { Module } from "vuex";
import { JobTitle, JobTitleActionTypes, JobTitleGetterTypes } from "./types";
import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const jobTitle: Module<DefaultState<JobTitle[]>, RootState> = {
    namespaced: true,
    state: {
        data: [],
        status: LoadingTypes.IDLE
    },
    mutations,
    actions,
    getters
};
export default jobTitle;
