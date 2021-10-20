import EmployeesVue from "@/views/Employees.vue";
import EmployeeDetails from "@/views/EmployeeDetails.vue";
import StoreInfo from "@/views/StoreInfo.vue";
import Schedule from "@/views/Schedule.vue";
import {
    createRouter,
    createWebHashHistory,
    createWebHistory,
    RouteRecordRaw
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "home",
        component: EmployeesVue
    },
    {
        path: "/employees",
        name: "employees",
        component: EmployeesVue
    },
    {
        path: "/employees/:id",
        name: "employeeDetails",
        component: EmployeeDetails,
        meta: {
            show: false
        }
    },
    {
        path: "/store",
        name: "storeInfo",
        component: StoreInfo
    },
    {
        path: "/schedule",
        name: "schedule",
        component: Schedule
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
