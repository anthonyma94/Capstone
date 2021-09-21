import { useStore } from "@/store";
import { ActionTypes, GetterTypes, LoadingTypes } from "@/store/types";
import { computed } from "vue";
import { JobTitle, JobTitleActionTypes, JobTitleGetterTypes } from "./types";

const useJobTitle = () => {
    const store = useStore();
    const storeKey = "jobTitle/";

    return {
        [GetterTypes.GET_ALL]: () =>
            store.getters[storeKey + GetterTypes.GET_ALL] as JobTitle[],
        [GetterTypes.GET_STATUS]: () =>
            store.getters[storeKey + GetterTypes.GET_STATUS] as LoadingTypes,
        [JobTitleGetterTypes.GET_ALL_WITH_PEOPLE_AMOUNT]: () =>
            store.getters[
                storeKey + JobTitleGetterTypes.GET_ALL_WITH_PEOPLE_AMOUNT
            ] as JobTitle & { numOfEmps: number }[],
        [ActionTypes.INITIALIZE_DATA]: (): Promise<void> =>
            store.dispatch(storeKey + ActionTypes.INITIALIZE_DATA),
        [ActionTypes.DELETE_DATA]: (id: string): Promise<void> =>
            store.dispatch(storeKey + ActionTypes.DELETE_DATA, id),
        [JobTitleActionTypes.ADD_TITLE]: (title: string): Promise<void> =>
            store.dispatch(storeKey + JobTitleActionTypes.ADD_TITLE, title)
    };
};
export default useJobTitle;
