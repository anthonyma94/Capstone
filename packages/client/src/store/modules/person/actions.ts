import axios from "@/services/axios";
import {
    ActionTypes,
    LoadingTypes,
    MutationTypes,
    RootState
} from "@/store/types";
import { ActionTree } from "vuex";
import { Person, PersonActionTypes, PersonState } from "./types";

const actions: ActionTree<PersonState, RootState> = {
    [ActionTypes.INITIALIZE_DATA]: async ({ commit }) => {
        commit(MutationTypes.SET_STATUS, LoadingTypes.LOADING);
        const res = await axios.get("/person");
        // const data = res.data.map((item: Person) => {
        //     const availabilities = item.availabilities.map(i => {
        //         return {
        //             ...i,
        //             day: {
        //                 ...i.day,
        //                 start: i.day.start.replace(/:\d{2}$/g, ""),
        //                 end: i.day.end.replace(/:\d{2}$/g, "")
        //             }
        //         };
        //     });
        //     return {
        //         ...item,
        //         availabilities
        //     };
        // });
        commit(MutationTypes.SET_DATA, res.data);
        commit(MutationTypes.SET_STATUS, LoadingTypes.SUCCESS);
    },
    [ActionTypes.UPDATE_DATA]: async (
        { commit, rootState },
        payload: Person
    ) => {
        commit(MutationTypes.SET_STATUS, LoadingTypes.LOADING);
        const data = payload;
        console.log(data);

        if (typeof data.jobTitle !== "object") {
            const jobTitle = rootState.jobTitle.data.find(
                i => i.name === ((data.jobTitle as any) as string)
            );
            data.jobTitle = jobTitle!;
        }

        if (!data.id) {
            // new person
        } else {
            const res = await axios.put(`/person/${data.id}`, data);
        }
        commit(MutationTypes.UPDATE_DATA, data);
        commit(MutationTypes.SET_STATUS, LoadingTypes.SUCCESS);
    },
    [PersonActionTypes.UPDATE_AVAILABILITY]: async ({ commit }, payload) => {
        commit(MutationTypes.SET_STATUS, LoadingTypes.LOADING);
    }
};
export default actions;
