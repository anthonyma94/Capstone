import axios from "@/services/axios";
import { ActionTypes, GetterTypes, MutationTypes } from "@/store/types";
import { computed } from "vue";
import { Action, Module, Mutation } from "vuex-module-decorators";
import BaseModule, { updateServer } from "../BaseModule";
import { Person, PersonActionTypes } from "./types";

@Module({ namespaced: true, name: "person" })
export default class PersonModule extends BaseModule<Person> {
    data: Person[] = [];

    get [GetterTypes.GET_BY_ID]() {
        return (id: string) => {
            // return computed(() => this.data.find(i => i.id === id)) as any;
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

    async [ActionTypes.DELETE_DATA](data: Person) {}

    @Action({ rawError: true })
    async [PersonActionTypes.ADD_AVAILBILITY](params: {
        personId: string;
        availabilities: {
            start: string;
            end: string;
            day: number;
        }[];
    }) {
        await updateServer(this.context.commit, async () => {
            const res = await axios.post(
                `/person/${params.personId}/availability`,
                params.availabilities
            );

            if (res.data.length > 0) {
                const personIndex = this.data.findIndex(
                    x => x.id === params.personId
                )!;
                this.data[personIndex].availabilities.push(...res.data);
            }
        });
    }

    @Action
    async [PersonActionTypes.REMOVE_AVAILABILITY](params: {
        personId: string;
        availability: string;
    }) {
        await updateServer(this.context.commit, async () => {
            const { personId, availability } = params;
            await axios.delete(
                `/person/${personId}/availability/${availability}`
            );
            const personIndex = this.data.findIndex(i => i.id === personId);
            this.data[personIndex].availabilities = this.data[
                personIndex
            ].availabilities.filter(x => x.id !== availability);
        });
    }

    @Action
    async EDIT_AVAILABILITY(params: {
        id: string;
        availability: {
            id: string;
            start: string;
            end: string;
            day: number;
        };
    }) {
        await updateServer(this.context.commit, async () => {
            const res = await axios.put(
                `/person/${params.id}/availability`,
                params.availability
            );

            const personIndex = this.data.findIndex(x => x.id === params.id)!;
            const changedIndex = this.data[
                personIndex
            ].availabilities.findIndex(x => x.id === params.availability.id)!;

            this.data[personIndex].availabilities[changedIndex] = res.data;
        });
    }

    @Action
    async EDIT_PERSON(params: {
        pay: number;
        maxWeeklyHours: number;
        jobTitle: string;
        role: string;
        id: string;
        firstName: string;
        lastName: string;
        address: string;
        province: string;
        postal: string;
        city: string;
        phone: string;
    }) {
        await updateServer(this.context.commit, async () => {
            const res = await axios.put(`/person/${params.id}`, params);

            if (params.id !== "new" && res.data) {
                const personIndex = this.data.findIndex(
                    x => x.id === params.id
                );
                this.data[personIndex] = res.data;
            } else {
                this.data.push(res.data);
            }
        });
    }
}
