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

register();

createApp(App)
    .use(store, key)
    .use(router)
    .use(PrimeVue)
    .mount("#app");
