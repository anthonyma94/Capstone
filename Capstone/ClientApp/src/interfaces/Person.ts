import IJobTitle from "./JobTitle";

export default interface IPerson {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    province: string;
    postal: string;
    jobTitle: IJobTitle | string;
    role: "FT" | "PT";
    pay: number;
    phone: string;
    maxWeeklyHours: number;
}
