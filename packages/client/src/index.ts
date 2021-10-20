import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store, { key } from "./store";
import PrimeVue from "primevue/config";
import "./app.postcss";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import register from "./services/stringService";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import dayjs from "dayjs";
import customParse from "dayjs/plugin/customParseFormat";

register();
dayjs.extend(customParse);

library.add(fas, fab, far);

createApp(App)
    .use(store, key)
    .use(router)
    .use(PrimeVue)
    .mount("#app");
