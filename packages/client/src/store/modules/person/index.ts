import axios from "@/services/axios";
import {
    ActionTypes,
    GetterTypes,
    LoadingTypes,
    MutationTypes
} from "@/store/types";
import { computed } from "vue";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import BaseModule, { updateServer } from "../BaseModule";
import { Person, PersonActionTypes } from "./types";

@Module({ namespaced: true, name: "person" })
export default class PersonModule extends BaseModule<Person> {
    data: Person[] = [];

    get [GetterTypes.GET_BY_ID]() {
        return (id: string) => {
            return computed(() => this.data.find(i => i.id === id));
        };
    }

    @Mutation
    [MutationTypes.REMOVE_DATA](data: Person) {
        this.data = this.data.filter(x => x.id !== data.id);
    }

    @Mutation
    [MutationTypes.UPDATE_DATA](data: Person) {
        const index = this.data.findIndex(i => data.id === i.id);
        this.data[index] = data;
    }

    @Action
    async [ActionTypes.INITIALIZE_DATA]() {
        await updateServer(this.context.commit, { url: "/person" });
    }

    @Action
    async [ActionTypes.UPDATE_DATA](data: Person) {
        await updateServer(this.context.commit, async () => {
            if (!data.id) {
                // new person
            } else {
                const res = await axios.put(`/person/${data.id}`, data);
            }
            this.context.commit(MutationTypes.UPDATE_DATA, data);
        });
    }

    @Action
    async [ActionTypes.DELETE_DATA](data: Person) {}

    @Action({ rawError: true })
    async [PersonActionTypes.ADD_AVAILBILITY](params: {
        id: string;
        data: Person["availabilities"] | Person["availabilities"][0];
    }) {
        await updateServer(this.context.commit, async () => {
            const { id, data } = params;
            const res = await axios.post(
                `/person/${id}/availability`,
                Array.isArray(data) ? data : [data]
            );
            console.log(res);
            this.context.commit(MutationTypes.UPDATE_DATA, res.data);
        });
    }

    @Action({ rawError: true })
    async [PersonActionTypes.REMOVE_AVAILABILITY](params: {
        id: string;
        item: Person["availabilities"][0];
    }) {
        await updateServer(this.context.commit, async () => {
            const res = await axios.delete(
                `/person/${params.id}/availability`,
                { data: params.item }
            );
            const index = this.data.findIndex(i => i.id === params.id);
            const person = this.data[index];
            person.availabilities.filter(x => x.id !== params.id);
            this.context.commit(MutationTypes.UPDATE_DATA, person);
        });
    }
}
