"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("./config/mikro-orm.config"));
const Store_1 = __importDefault(require("./entities/Store"));
const sampleStoreHours_1 = __importDefault(require("./assets/samples/sampleStoreHours"));
const samplePeople_1 = __importDefault(require("./assets/samples/samplePeople"));
const sampleScheduleRules_1 = __importDefault(require("./assets/samples/sampleScheduleRules"));
const DayItem_1 = __importDefault(require("./entities/DayItem"));
const StoreHour_1 = __importDefault(require("./entities/StoreHour"));
const JobTitle_1 = require("./entities/JobTitle");
const Person_1 = require("./entities/Person");
const Availability_1 = __importDefault(require("./entities/Availability"));
const dayjs_1 = __importDefault(require("dayjs"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
const ScheduleRuleItem_1 = __importDefault(require("./entities/ScheduleRuleItem"));
const ScheduleRule_1 = __importDefault(require("./entities/ScheduleRule"));
const Authentication_1 = __importDefault(require("./entities/Authentication"));
dayjs_1.default.extend(customParseFormat_1.default);
(async function () {
    const orm = await core_1.MikroORM.init({
        ...mikro_orm_config_1.default,
        multipleStatements: true,
        migrations: {
            disableForeignKeys: true
        }
    });
    const em = orm.em;
    const connection = em.getConnection();
    const res = await connection.execute(`select * from information_schema.tables where table_schema = '${mikro_orm_config_1.default.dbName}' and table_type = 'BASE TABLE'`);
    const tableNames = res.map((item) => item["TABLE_NAME"]);
    let sqlMsg = tableNames.reduce((acc, cur) => {
        if (!cur.includes("mikro")) {
            acc += `TRUNCATE TABLE ${cur};`;
        }
        return acc;
    }, "SET FOREIGN_KEY_CHECKS = 0;");
    sqlMsg += "SET FOREIGN_KEY_CHECKS = 1;";
    await connection.execute(sqlMsg);
    const migrator = orm.getMigrator();
    try {
        await migrator.createInitialMigration();
    }
    catch {
        await migrator.createMigration();
    }
    await migrator.up();
    const adminAcc = new Authentication_1.default({
        username: "admin",
        password: "password",
        role: "admin"
    });
    em.persist(adminAcc);
    const store = new Store_1.default("My Store");
    em.persist(store);
    const storeHours = sampleStoreHours_1.default.map(hour => new StoreHour_1.default(store, new DayItem_1.default({
        start: hour.start,
        end: hour.end,
        day: hour.day
    })));
    em.persist(storeHours);
    const jobTitles = [
        ["Stock", "#3788D8"],
        ["Sales", "#96009c"],
        ["Cashier", "#039c00"],
        ["Manager", "#b32100"]
    ].map(item => new JobTitle_1.JobTitle(item[0], item[1]));
    em.persist(jobTitles);
    const maxPeople = samplePeople_1.default.length;
    let maxSales = Math.round(maxPeople * 0.5);
    let maxStock = Math.round(maxPeople * 0.2);
    let maxCash = Math.round(maxPeople * 0.2);
    let maxManager = Math.round(maxPeople * 0.1);
    const people = samplePeople_1.default.map(samplePerson => {
        let jobTitle = {};
        if (maxSales > 0) {
            jobTitle = jobTitles.find(x => x.name === "Sales");
            maxSales--;
        }
        else if (maxStock > 0) {
            jobTitle = jobTitles.find(x => x.name === "Stock");
            maxStock--;
        }
        else if (maxCash > 0) {
            jobTitle = jobTitles.find(x => x.name === "Cashier");
            maxCash--;
        }
        else {
            jobTitle = jobTitles.find(x => x.name === "Manager");
            maxManager--;
        }
        const person = new Person_1.Person({
            ...samplePerson,
            maxWeeklyHours: 0,
            jobTitle,
            role: Math.random() > 0.5 ? "FT" : "PT"
        });
        const auth = new Authentication_1.default({
            username: `${samplePerson.firstName.charAt(0)}${samplePerson.lastName.replace(/[\W_]/g, "")}`.toLowerCase(),
            password: "password",
            role: "user",
            person
        });
        em.persist(auth);
        const availabilities = [];
        if (person.role === "FT") {
            storeHours.forEach(hour => {
                availabilities.push(new Availability_1.default({
                    person,
                    isApproved: true,
                    day: hour.day
                }));
            });
            person.maxWeeklyHours = 40;
        }
        else {
            let skipped = 0;
            for (let hour of storeHours) {
                if (Math.random() > 0.4 && skipped < 3) {
                    skipped++;
                    continue;
                }
                const day = hour.day.day;
                const start = (0, dayjs_1.default)(hour.day.start, "HH:mm:ss");
                const end = (0, dayjs_1.default)(hour.day.end, "HH:mm:ss");
                let totalMinutes = end.diff(start, "minutes");
                let randomMinute1 = Math.floor(Math.random() * totalMinutes);
                let randomMinute2 = Math.floor(Math.random() * totalMinutes);
                if (randomMinute1 % 30 !== 0)
                    randomMinute1 += 30 - (randomMinute1 % 30);
                if (randomMinute2 % 30 !== 0)
                    randomMinute2 += 30 - (randomMinute2 % 30);
                let randomStart = start.add(Math.min(randomMinute1, randomMinute2), "minutes");
                let randomEnd = start.add(Math.max(randomMinute1, randomMinute2), "minutes");
                if (randomStart < start)
                    randomStart = start;
                if (randomEnd > end)
                    randomEnd = end;
                if (randomEnd.diff(randomStart, "minutes") < 180) {
                    if (randomStart.subtract(180, "minutes") >= start)
                        randomStart = randomStart.subtract(180, "minutes");
                    else
                        randomEnd = randomEnd.add(180, "minutes");
                }
                const dayItem = new DayItem_1.default({
                    start: randomStart.format("HH:mm:ss"),
                    end: randomEnd.format("HH:mm:ss"),
                    day
                });
                const availability = new Availability_1.default({
                    person,
                    isApproved: true,
                    day: dayItem
                });
                availabilities.push(availability);
            }
            const totalHours = availabilities.reduce((acc, cur) => {
                const difference = (0, dayjs_1.default)(cur.day.end, "HH:mm:ss").diff((0, dayjs_1.default)(cur.day.start, "HH:mm:ss"), "hours");
                return acc + difference;
            }, 0);
            let randomMaxHour = Math.random() * (totalHours - 5) + 5;
            randomMaxHour = Math.round(randomMaxHour * 2) / 2;
            person.maxWeeklyHours = randomMaxHour;
        }
        person.availabilities.add(...availabilities);
        em.persist(availabilities);
        return person;
    });
    em.persist(people);
    const scheduleRules = [];
    const scheduleRuleItems = [];
    for (let day = 1; day <= 5; day++) {
        for (const i of sampleScheduleRules_1.default.weekday) {
            const rule = new ScheduleRule_1.default({
                day: new DayItem_1.default({
                    start: i.day.start,
                    end: i.day.end,
                    day
                })
            });
            scheduleRules.push(rule);
            for (const j of i.rules) {
                const item = new ScheduleRuleItem_1.default({
                    scheduleRule: rule,
                    jobTitle: jobTitles.find(x => x.name === j.jobTitle),
                    amount: j.amount
                });
                scheduleRuleItems.push(item);
            }
        }
    }
    em.persist(scheduleRules);
    em.persist(scheduleRuleItems);
    await em.flush();
    process.exit(0);
})();
//# sourceMappingURL=seed-database.js.map