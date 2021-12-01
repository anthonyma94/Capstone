import dayjs, { Dayjs } from "dayjs";
import customParse from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";
import isBetween from "dayjs/plugin/isBetween";
import dayNames from "@/assets/dayNames";
import monthNames from "@/assets/monthNames";

function register() {
    dayjs.extend(customParse);
    dayjs.extend(utc);
    dayjs.extend(tz);
    dayjs.extend(isBetween);
}

export function convertTo12Hour(time: string) {
    return dayjs(time, ["HH:mm", "HH:mm:ss"]).format("hh:mm A");
}

export function convertTo24Hour(time: string) {
    return dayjs(time, ["hh:mm A", "hh:mm:ss A"]).format("HH:mm");
}

export function localecompareDayjs(a: Dayjs, b: Dayjs) {
    if (a.isBefore(b)) return -1;
    if (a.isAfter(b)) return 1;
    return 0;
}

export function localecompareDaynames(a: string, b: string) {
    const firstIndex = dayNames.findIndex(
        x => x.toLowerCase().trim() === a.toLowerCase().trim()
    );
    const secondIndex = dayNames.findIndex(
        x => x.toLowerCase().trim() === b.toLowerCase().trim()
    );

    return firstIndex - secondIndex;
}

export function localecompareMonthnames(a: string, b: string) {
    const firstIndex = monthNames.findIndex(x =>
        x
            .toLowerCase()
            .trim()
            .includes(a.toLowerCase().trim())
    );
    const secondIndex = monthNames.findIndex(x =>
        x
            .toLowerCase()
            .trim()
            .includes(b.toLowerCase().trim())
    );

    return firstIndex - secondIndex;
}

export default register;
