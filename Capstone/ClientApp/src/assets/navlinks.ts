import NewEmployee from "../pages/NewEmployee";
import StoreInfo from "../pages/StoreInfo";
import Employees from "../pages/Employees";
import Login from "../pages/Login";

interface Links {
    text: string;
    link: string;
    page: () => JSX.Element;
    includeInNavbar: boolean;
}
export default [
    {
        text: "Employees",
        link: "/employees",
        page: Employees,
        includeInNavbar: true,
    },
    {
        text: "Store Info",
        link: "/storeInfo",
        page: StoreInfo,
        includeInNavbar: true,
    },
    {
        text: "Create New Employee",
        link: "/employee/:id?",
        page: NewEmployee,
        includeInNavbar: false,
    },
    {
        text: "Login",
        link: "/",
        page: Login,
        includeInNavbar: false,
    },
] as Links[];
