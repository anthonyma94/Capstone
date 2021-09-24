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
    city: string;
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
    UPDATE_AVAILABILITY = "UPDATE_AVAILABILITY",
    ADD_AVAILBILITY = "ADD_AVAILABILITY",
    REMOVE_AVAILABILITY = "REMOVE_AVAILABILITY"
}

export interface PersonState extends DefaultState<Person[]> {}
