import EmployeesVue from "@/views/Employees.vue";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/employees",
        name: "Employees",
        component: EmployeesVue
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
