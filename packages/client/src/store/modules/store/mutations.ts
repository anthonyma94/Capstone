import { mapMutations } from "@/store/services";
import { MutationTree } from "vuex";
import { StoreState } from "./types";

const mutations: MutationTree<StoreState> = {
    ...mapMutations()
};
export default mutations;
