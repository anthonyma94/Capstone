import { mapMutations } from "@/store/services";
import { MutationTypes } from "@/store/types";
import { MutationTree } from "vuex";
import { Person, PersonState } from "./types";

const mutations: MutationTree<PersonState> = {
    ...mapMutations(),
    [MutationTypes.UPDATE_DATA]: (state, payload: Person) => {
        const data = state.data;
        const index = data.findIndex(i => payload.id === i.id);
        data[index] = payload;
        state.data = data;
    }
};
export default mutations;
