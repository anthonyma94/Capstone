import { GetterTypes, RootState } from "@/store/types";
import { GetterTree } from "vuex";
import { Person } from "../person/types";
import { JobTitleGetterTypes, JobTitleState } from "./types";

const getters: GetterTree<JobTitleState, RootState> = {
    [GetterTypes.GET_ALL]: state => state.data,
    [GetterTypes.GET_STATUS]: state => state.status,
    [JobTitleGetterTypes.GET_ALL_WITH_PEOPLE_AMOUNT]: (state, _, root) =>
        state.data.map(item => {
            return {
                ...item,
                numOfEmps: root.person.data.filter(
                    (person: Person) => person.jobTitle.id === item.id
                ).length
            };
        })
};
export default getters;
