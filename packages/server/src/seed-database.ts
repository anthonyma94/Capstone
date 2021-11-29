import { MikroORM } from "@mikro-orm/core";
import config from "./config/mikro-orm.config";
import Store from "./entities/Store";
import sampleHours from "./assets/samples/sampleStoreHours";
import samplePeople from "./assets/samples/samplePeople";
import sampleScheduleRules from "./assets/samples/sampleScheduleRules";
import DayItem, { DayNames } from "./entities/DayItem";
import StoreHour from "./entities/StoreHour";
import { JobTitle } from "./entities/JobTitle";
import { Person } from "./entities/Person";
import Availability from "./entities/Availability";
import dayjs from "dayjs";
import customParse from "dayjs/plugin/customParseFormat";
import ScheduleRuleItem from "./entities/ScheduleRuleItem";
import ScheduleRule from "./entities/ScheduleRule";
import Authentication from "./entities/Authentication";
dayjs.extend(customParse);

(async function() {
    // Init config
    const orm = await MikroORM.init({
        ...config,
        multipleStatements: true,
        migrations: {
            disableForeignKeys: true
        }
    });
    const em = orm.em;
    const connection = em.getConnection();

    // Delete all data from tables
    const res = await connection.execute(
        `select * from information_schema.tables where table_schema = '${config.dbName}' and table_type = 'BASE TABLE'`
    );
    const tableNames: Array<string> = res.map(
        (item: any) => item["TABLE_NAME"]
    );
    let sqlMsg = tableNames.reduce((acc, cur) => {
        if (!cur.includes("mikro")) {
            acc += `TRUNCATE TABLE ${cur};`;
        }
        return acc;
    }, "SET FOREIGN_KEY_CHECKS = 0;");
    sqlMsg += "SET FOREIGN_KEY_CHECKS = 1;";
    await connection.execute(sqlMsg);

    // Create and update migration
    const migrator = orm.getMigrator();

    try {
        await migrator.createInitialMigration();
    } catch {
        await migrator.createMigration();
    }
    await migrator.up();

    // Seed data

    // Add admin account
    const adminAcc = new Authentication({
        username: "admin",
        password: "password",
        role: "admin"
    });

    em.persist(adminAcc);

    // Store & Store Hours
    const store = new Store("My Store");
    em.persist(store);
    const storeHours = sampleHours.map(
        hour =>
            new StoreHour(
                store,
                new DayItem({
                    start: hour.start,
                    end: hour.end,
                    day: hour.day
                })
            )
    );
    em.persist(storeHours);

    // Job Title
    const jobTitles = [
        ["Stock", "#3788D8"],
        ["Sales", "#96009c"],
        ["Cashier", "#039c00"],
        ["Manager", "#b32100"]
    ].map(item => new JobTitle(item[0], item[1]));
    em.persist(jobTitles);

    // Person & Availability
    const maxPeople = samplePeople.length;
    let maxSales = Math.round(maxPeople * 0.5);
    let maxStock = Math.round(maxPeople * 0.2);
    let maxCash = Math.round(maxPeople * 0.2);
    let maxManager = Math.round(maxPeople * 0.1);

    const people = samplePeople.map(samplePerson => {
        let jobTitle: any = {};
        if (maxSales > 0) {
            jobTitle = jobTitles.find(x => x.name === "Sales");
            maxSales--;
        } else if (maxStock > 0) {
            jobTitle = jobTitles.find(x => x.name === "Stock");
            maxStock--;
        } else if (maxCash > 0) {
            jobTitle = jobTitles.find(x => x.name === "Cashier");
            maxCash--;
        } else {
            jobTitle = jobTitles.find(x => x.name === "Manager");
            maxManager--;
        }

        const person = new Person({
            ...samplePerson,
            maxWeeklyHours: 0,
            jobTitle,
            role: Math.random() > 0.5 ? "FT" : "PT"
        });

        const auth = new Authentication({
            username: `${samplePerson.firstName.charAt(
                0
            )}${samplePerson.lastName.replace(/[\W_]/g, "")}`.toLowerCase(),
            password: "password",
            role: "user",
            person
        });

        em.persist(auth);

        const availabilities: Availability[] = [];

        if (person.role === "FT") {
            storeHours.forEach(hour => {
                availabilities.push(
                    new Availability({
                        person,
                        isApproved: true,
                        day: hour.day
                    })
                );
            });
            person.maxWeeklyHours = 40;
        } else {
            let skipped = 0;
            for (let hour of storeHours) {
                // Picks random days to have availability (~60/40)
                if (Math.random() > 0.4 && skipped < 3) {
                    skipped++;
                    continue;
                }

                const day = hour.day.day!;
                const start = dayjs(hour.day.start, "HH:mm:ss");
                const end = dayjs(hour.day.end, "HH:mm:ss");

                // Calculates total elapsed minutes between start and end
                let totalMinutes = end.diff(start, "minutes");

                let randomMinute1 = Math.floor(Math.random() * totalMinutes);
                let randomMinute2 = Math.floor(Math.random() * totalMinutes);

                if (randomMinute1 % 30 !== 0)
                    randomMinute1 += 30 - (randomMinute1 % 30);
                if (randomMinute2 % 30 !== 0)
                    randomMinute2 += 30 - (randomMinute2 % 30);

                let randomStart = start.add(
                    Math.min(randomMinute1, randomMinute2),
                    "minutes"
                );
                let randomEnd = start.add(
                    Math.max(randomMinute1, randomMinute2),
                    "minutes"
                );

                // Ensures availability between store hours
                if (randomStart < start) randomStart = start;
                if (randomEnd > end) randomEnd = end;

                // Ensures at least 3 hours per availability
                if (randomEnd.diff(randomStart, "minutes") < 180) {
                    if (randomStart.subtract(180, "minutes") >= start)
                        randomStart = randomStart.subtract(180, "minutes");
                    else randomEnd = randomEnd.add(180, "minutes");
                }

                const dayItem = new DayItem({
                    start: randomStart.format("HH:mm:ss"),
                    end: randomEnd.format("HH:mm:ss"),
                    day
                });

                const availability = new Availability({
                    person,
                    isApproved: true,
                    day: dayItem
                });
                availabilities.push(availability);
            }

            const totalHours = availabilities.reduce((acc, cur) => {
                const difference = dayjs(cur.day.end, "HH:mm:ss").diff(
                    dayjs(cur.day.start, "HH:mm:ss"),
                    "hours"
                );
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

    // Schedule Rules
    const scheduleRules: Array<ScheduleRule> = [];
    const scheduleRuleItems: Array<ScheduleRuleItem> = [];

    for (let day = 1; day <= 5; day++) {
        for (const i of sampleScheduleRules.weekday) {
            const rule = new ScheduleRule({
                day: new DayItem({
                    start: i.day.start,
                    end: i.day.end,
                    day
                })
            });
            scheduleRules.push(rule);
            for (const j of i.rules) {
                const item = new ScheduleRuleItem({
                    scheduleRule: rule,
                    jobTitle: jobTitles.find(x => x.name === j.jobTitle)!,
                    amount: j.amount
                });
                scheduleRuleItems.push(item);
            }
        }
    }

    em.persist(scheduleRules);

    // for (const i of sampleScheduleRules) {
    //     for (const j of i.rules) {
    //         scheduleRuleItems.push(
    //             new ScheduleRuleItem({
    //                 scheduleRule: scheduleRules.find(
    //                     x =>
    //                         x.day.start === i.day.start &&
    //                         x.day.end === i.day.end &&
    //                         x.day.day === i.day.day
    //                 )!,
    //                 jobTitle: jobTitles.find(x => x.name === j.jobTitle)!,
    //                 amount: j.amount
    //             })
    //         );
    //     }
    // }

    em.persist(scheduleRuleItems);

    await em.flush();

    process.exit(0);
})();
