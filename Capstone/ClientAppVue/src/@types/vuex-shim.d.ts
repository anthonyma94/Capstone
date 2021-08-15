import { RootState } from "@/store";
import { Store } from "vuex";

/* eslint-disable */
declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $store: Store<RootState>;
    }
}
