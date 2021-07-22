import NewEmployee from "../components/NewEmployee";
import StoreInfo from "../components/StoreInfo";
import Employees from "../Employees";
import Login from "../Login";

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
        link: "/newEmployee",
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
