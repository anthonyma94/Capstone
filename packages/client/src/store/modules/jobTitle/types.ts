import { DefaultState } from "@/store/types";

export interface JobTitle {
    id: string;
    name: string;
}

export enum JobTitleActionTypes {
    ADD_TITLE = "ADD_TITLE"
}

export enum JobTitleGetterTypes {
    GET_ALL_WITH_PEOPLE_AMOUNT = "GET_ALL_WITH_PEOPLE_AMOUNT"
}

export interface JobTitleState extends DefaultState<JobTitle[]> {}
