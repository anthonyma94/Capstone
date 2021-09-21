import { useStore } from "@/store";
import { ActionTypes, GetterTypes, LoadingTypes } from "@/store/types";
import { Person } from "./types";

const usePerson = () => {
    const getterKey = "person/";
    const store = useStore();

    return {
        [GetterTypes.GET_ALL]: () => {
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
        },
        [GetterTypes.GET_BY_ID]: (id: string) => {
            const person = store.getters[getterKey + GetterTypes.GET_BY_ID](
                id
            ) as Person | undefined;
            if (person) {
                return {
                    ...person,
                    jobTitle: person.jobTitle.name
                };
            } else return undefined;
        },
        [GetterTypes.GET_STATUS]: () =>
            store.getters[getterKey + GetterTypes.GET_STATUS] as LoadingTypes,
        [ActionTypes.INITIALIZE_DATA]: (): Promise<void> =>
            store.dispatch(getterKey + ActionTypes.INITIALIZE_DATA),
        [ActionTypes.UPDATE_DATA]: (payload: any): Promise<void> =>
            store.dispatch(getterKey + ActionTypes.UPDATE_DATA, payload)
    };
};

export default usePerson;
