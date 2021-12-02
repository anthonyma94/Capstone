import EmployeesVue from "@/views/Employees.vue";
import EmployeeDetails from "@/views/EmployeeDetails.vue";
import StoreInfo from "@/views/StoreInfo.vue";
import Login from "@/views/Login.vue";
import Schedule from "@/views/Schedule.vue";
import RequestDetails from "@/views/RequestDetails.vue";
import Requests from "@/views/Requests.vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import axios from "@/services/axios";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "home",
        component: Login,
        meta: {
            showNav: false
        }
    },
    {
        path: "/employees",
        name: "employees",
        component: EmployeesVue,
        beforeEnter: async () => {
            const res = await axios.get("/auth");
            if (res.data) {
                if (res.data.role === "admin") return true;
                else return `/employees/${res.data.user}`;
            }
            return "/";
        }
    },
    {
        path: "/employees/:id",
        name: "employeeDetails",
        component: EmployeeDetails,
        beforeEnter: async to => {
            const res = await axios.get("/auth");
            if (res.data.role !== "admin" && res.data.user !== to.params.id)
                return `/employees/${res.data.user}`;
            else return true;
        },
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
    },
    {
        path: "/request-emp",
        name: "SubmitRequests",
        component: RequestDetails,
        meta: {
            show: "user"
        },
        beforeEnter: async () => {
            const res = await axios.get("/auth");
        }
    },
    {
        path: "/requests",
        name: "Requests",
        component: Requests,
        meta: {
            show: "admin"
        },
        beforeEnter: async () => {}
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async to => {
    if (to.matched.length === 0) {
        return "/";
    }
    const res = await axios.get("/auth");
    if (!res.data) {
        if (to.path === "/") return true;
        else return "/";
    } else {
        if (to.path === "/") return "/employees";
        else return true;
    }
});

export default router;
