import { updateServer } from "@/store/services";
import { ActionTypes, RootState } from "@/store/types";
import { ActionTree } from "vuex";
import { JobTitleActionTypes, JobTitleState } from "./types";

const actions: ActionTree<JobTitleState, RootState> = {
    [ActionTypes.INITIALIZE_DATA]: async ({ commit }) =>
        await updateServer(commit, { method: "get", url: "/jobtitle" }),
    [ActionTypes.DELETE_DATA]: async ({ commit }, id: string) =>
        await updateServer(commit, {
            method: "DELETE",
            url: `/jobtitle/${id}`
        }),
    [JobTitleActionTypes.ADD_TITLE]: async ({ commit }, payload: string) =>
        await updateServer(commit, {
            method: "post",
            url: "/jobtitle",
            data: { name: payload }
        })
};
export default actions;
