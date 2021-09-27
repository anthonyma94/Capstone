"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
dayjs_1.default.extend(customParseFormat_1.default);
const start = (0, dayjs_1.default)("10:00:00", "HH:mm:ss");
const end = (0, dayjs_1.default)("14:00:00", "HH:mm:ss");
const minutes = end.diff(start, "minutes");
console.log(end.format("HH:mm:ss"));
