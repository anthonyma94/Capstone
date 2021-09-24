import axios from "@/services/axios";
import { Module } from "vuex";
import { RootState } from "../..";
import {
    ActionTypes,
    GetterTypes,
    LoadingTypes,
    MutationTypes
} from "../../store-types";
import { JobTitle } from "../jobTitle";

export interface Person {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    province: string;
    postal: string;
    jobTitle: JobTitle;
    role: "FT" | "PT";
    pay: number;
    phone: string;
    maxWeeklyHours: number;
}

export interface PersonState {
    data: Person[];
    status: LoadingTypes;
}

const person: Module<PersonState, RootState> = {
    namespaced: true,
    state: {
        data: [],
        status: LoadingTypes.IDLE
    },
    mutations: {
        [MutationTypes.SET_DATA](state, payload) {
            state.data = payload;
        },
        [MutationTypes.SET_STATUS](state, payload) {
            state.status = payload;
        }
    },
    actions: {
        async [ActionTypes.INITIALIZE_DATA]({ commit }) {
            commit(MutationTypes.SET_STATUS, LoadingTypes.LOADING);
            const res = await axios.get("/people");
            commit(MutationTypes.SET_DATA, res.data);
            commit(MutationTypes.SET_STATUS, LoadingTypes.SUCCESS);
        }
    },
    getters: {
        [GetterTypes.GET_ALL]: state => state.data,
        [GetterTypes.GET_STATUS]: state => state.status
    }
};

export default person;
