import { mapMutations } from "@/store/services";
import { MutationTree } from "vuex";
import { JobTitleState } from "./types";

const mutations: MutationTree<JobTitleState> = {
    ...mapMutations()
};

export default mutations;
