import { useStore } from "@/store";
import {
    ActionTypes,
    GetterTypes,
    LoadingTypes,
    Status
} from "@/store/store-types";
import { Person } from ".";

const usePerson = () => {
    const getterKey = "person/";
    const store = useStore();

    const all = () => {
        const people = store.getters[
            getterKey + GetterTypes.GET_ALL
        ] as Person[];
        return people.map<Omit<Person, "jobTitle"> & { jobTitle: string }>(
            i => {
                return {
                    ...i,
                    jobTitle: i.jobTitle.name
                };
            }
        );
    };
    const status = () =>
        store.getters[getterKey + GetterTypes.GET_STATUS] as LoadingTypes;
    const initialize = (): Promise<void> =>
        store.dispatch(getterKey + ActionTypes.INITIALIZE_DATA);
    // const find = (serial: string) =>
    //     store.getters[getterKey + GetterTypes.GET_BY_ID](serial) as
    //         | (Forklift & { status?: Status })
    //         | undefined;
    // const set = (payload: any) =>
    //     store.dispatch(getterKey + ActionTypes.SET_DATA, payload);

    return {
        [GetterTypes.GET_ALL]: all,
        [GetterTypes.GET_STATUS]: status,
        [ActionTypes.INITIALIZE_DATA]: initialize
    };
};

export default usePerson;
