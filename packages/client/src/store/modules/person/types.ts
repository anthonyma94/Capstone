import { DefaultState } from "@/store/types";
import { DayItem } from "../dayItem";
import { JobTitle } from "../jobTitle/types";

export interface Person {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    province: string;
    postal: string;
    jobTitle: JobTitle;
    role: "FT" | "PT";
    pay: number;
    phone: string;
    maxWeeklyHours: number;
    availabilities: {
        id: string;
        isApproved: boolean;
        day: DayItem;
    }[];
}

export enum PersonActionTypes {
    UPDATE_AVAILABILITY = "UPDATE_AVAILABILITY"
}

export interface PersonState extends DefaultState<Person[]> {}
