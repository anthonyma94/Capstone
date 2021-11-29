import { DefaultState } from "@/store/types";
import { Dayjs } from "dayjs";
import { DayItem } from "../dayItem";

export interface Request {
    timeoff: TimeOff[];
}

export interface TimeOff {
    id: string;
    person: string;
    start: DayItem;
    end: DayItem;
    reason: string;
    isApproved?: boolean;
}

export interface RequestState extends DefaultState<Request> {}
