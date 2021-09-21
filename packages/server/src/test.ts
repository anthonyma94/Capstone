import dayjs from "dayjs";
import customParse from "dayjs/plugin/customParseFormat";

dayjs.extend(customParse);
const start = dayjs("10:00:00", "HH:mm:ss");
const end = dayjs("14:00:00", "HH:mm:ss");

const minutes = end.diff(start, "minutes");

console.log(end.format("HH:mm:ss"));
