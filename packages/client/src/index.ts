/**
 * Entrypoint for client. Registers all necessary util functions,
 * creates a Vue instance and adds all necessary plugins.
 * Imports all library css.
 */

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store, { key } from "./store";
import PrimeVue from "primevue/config";
import register from "./services/stringService";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import dayjsRegister from "@/services/dates";
import ToastService from "primevue/toastservice";
import "./app.postcss";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "tippy.js/dist/tippy.css";

register();
dayjsRegister();

library.add(fas, fab, far);

createApp(App)
    .use(store, key)
    .use(router)
    .use(PrimeVue)
    .use(ToastService)
    .mount("#app");
