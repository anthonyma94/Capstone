import { MikroORM } from "@mikro-orm/core";
import config from "./config/mikro-orm.config";
import Store from "./entities/Store";
import sampleHours from "./assets/samples/sampleStoreHours";
import samplePeople from "./assets/samples/samplePeople";
import DayItem, { DayNames } from "./entities/DayItem";
import StoreHour from "./entities/StoreHour";
import { JobTitle } from "./entities/JobTitle";
import { Person } from "./entities/Person";
import Availability from "./entities/Availability";
import dayjs from "dayjs";
import customParse from "dayjs/plugin/customParseFormat";
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

    // Store & Store Hours
    const store = new Store("My Store");
    em.persist(store);
    const storeHours = sampleHours.map(
        hour =>
            new StoreHour(store, new DayItem(hour.start, hour.end, hour.day))
    );
    em.persist(storeHours);

    // Job Title
    const jobTitles = ["Stock", "Sales", "Cashier", "Manager"].map(
        item => new JobTitle(item)
    );
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
            jobTitle
        });

        const availabilities: Availability[] = [];

        if (person.role === "FT") {
            storeHours.forEach(hour => {
                availabilities.push(new Availability(person, true, hour.day));
            });
            person.maxWeeklyHours = 40;
        } else {
            let skipped = 0;
            for (let hour of storeHours) {
                // Picks random days to have availability (~50/50)
                if (Math.random() > 0.5 && skipped < 4) {
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
                    Math.min(randomMinute1, randomMinute2),
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

                const dayItem = new DayItem(
                    randomStart.format("HH:mm:ss"),
                    randomEnd.format("HH:mm:ss"),
                    day
                );

                const availability = new Availability(person, true, dayItem);
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
        return person;
    });

    em.persist(people);

    await em.flush();

    process.exit(0);
})();
