using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Capstone.Migrations
{
    public partial class initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "DayLineItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Day = table.Column<int>(type: "int", nullable: true),
                    Date = table.Column<DateTime>(type: "Date", nullable: true),
                    Start = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                    End = table.Column<TimeSpan>(type: "time(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DayLineItems", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "JobTitles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobTitles", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Schedules",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    IsDefault = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schedules", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Stores",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stores", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ScheduleRules",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    DayId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScheduleRules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ScheduleRules_DayLineItems_DayId",
                        column: x => x.DayId,
                        principalTable: "DayLineItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Person",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    FirstName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LastName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Address = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Province = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Postal = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    JobTitleId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Role = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Pay = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    Phone = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Username = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Password = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MaxWeeklyHours = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Person", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Person_JobTitles_JobTitleId",
                        column: x => x.JobTitleId,
                        principalTable: "JobTitles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ScheduleLineItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ScheduleId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    DayId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScheduleLineItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ScheduleLineItems_DayLineItems_DayId",
                        column: x => x.DayId,
                        principalTable: "DayLineItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ScheduleLineItems_Schedules_ScheduleId",
                        column: x => x.ScheduleId,
                        principalTable: "Schedules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "StoreHourLineItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    StoreId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    DayId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StoreHourLineItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StoreHourLineItems_DayLineItems_DayId",
                        column: x => x.DayId,
                        principalTable: "DayLineItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StoreHourLineItems_Stores_StoreId",
                        column: x => x.StoreId,
                        principalTable: "Stores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ScheduleRuleEmpLineItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ScheduleRuleId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    JobTitleId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Amount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScheduleRuleEmpLineItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ScheduleRuleEmpLineItems_JobTitles_JobTitleId",
                        column: x => x.JobTitleId,
                        principalTable: "JobTitles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ScheduleRuleEmpLineItems_ScheduleRules_ScheduleRuleId",
                        column: x => x.ScheduleRuleId,
                        principalTable: "ScheduleRules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Availabilities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    PersonId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    IsApproved = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Availabilities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Availabilities_Person_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Person",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "TimeOffs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    PersonId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Reason = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsApproved = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeOffs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TimeOffs_Person_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Person",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PersonScheduleLineItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    PersonId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    ScheduleId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PersonScheduleLineItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PersonScheduleLineItems_Person_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Person",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PersonScheduleLineItems_ScheduleLineItems_ScheduleId",
                        column: x => x.ScheduleId,
                        principalTable: "ScheduleLineItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AvailabilityLineItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    AvailabilityId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    DayId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AvailabilityLineItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AvailabilityLineItems_Availabilities_AvailabilityId",
                        column: x => x.AvailabilityId,
                        principalTable: "Availabilities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AvailabilityLineItems_DayLineItems_DayId",
                        column: x => x.DayId,
                        principalTable: "DayLineItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "TimeOffLineItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    TimeOffId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    DayLineItemId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeOffLineItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TimeOffLineItems_DayLineItems_DayLineItemId",
                        column: x => x.DayLineItemId,
                        principalTable: "DayLineItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TimeOffLineItems_TimeOffs_TimeOffId",
                        column: x => x.TimeOffId,
                        principalTable: "TimeOffs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ShiftChanges",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ScheduleId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    NewPersonId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    IsEmployeeApproved = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IsEmployerApproved = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShiftChanges", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ShiftChanges_Person_NewPersonId",
                        column: x => x.NewPersonId,
                        principalTable: "Person",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ShiftChanges_PersonScheduleLineItems_ScheduleId",
                        column: x => x.ScheduleId,
                        principalTable: "PersonScheduleLineItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SickCalls",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ScheduleId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    IsApproved = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SickCalls", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SickCalls_PersonScheduleLineItems_ScheduleId",
                        column: x => x.ScheduleId,
                        principalTable: "PersonScheduleLineItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "DayLineItems",
                columns: new[] { "Id", "Date", "Day", "End", "Start" },
                values: new object[,]
                {
                    { new Guid("ed405119-0d1a-4442-aef3-60a51a5ec5b4"), null, 0, new TimeSpan(0, 18, 0, 0, 0), new TimeSpan(0, 10, 0, 0, 0) },
                    { new Guid("30e3944e-803b-4ce6-aee6-dd0cb60dc479"), null, 1, new TimeSpan(0, 22, 0, 0, 0), new TimeSpan(0, 9, 0, 0, 0) },
                    { new Guid("ada842b0-757d-4118-a84a-c6d296f4d10d"), null, 2, new TimeSpan(0, 22, 0, 0, 0), new TimeSpan(0, 9, 0, 0, 0) },
                    { new Guid("38e83d67-e75f-48d1-91e0-93f8c877480f"), null, 3, new TimeSpan(0, 22, 0, 0, 0), new TimeSpan(0, 9, 0, 0, 0) },
                    { new Guid("3cbff644-7d0a-49aa-9431-e69a18963449"), null, 4, new TimeSpan(0, 22, 0, 0, 0), new TimeSpan(0, 9, 0, 0, 0) },
                    { new Guid("b8655ac8-dc4f-4da2-b192-0b5fd473d4f4"), null, 5, new TimeSpan(0, 22, 0, 0, 0), new TimeSpan(0, 9, 0, 0, 0) },
                    { new Guid("b3302c3b-f1df-4097-a1ca-fb3e67e0e972"), null, 6, new TimeSpan(0, 16, 0, 0, 0), new TimeSpan(0, 9, 0, 0, 0) }
                });

            migrationBuilder.InsertData(
                table: "JobTitles",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("14481991-6bf5-4165-bfbd-2f417fcf1bd0"), "Stock" },
                    { new Guid("f25d2bef-c095-432b-adc1-9943bf503834"), "Sales" },
                    { new Guid("40855ddf-fe2c-44b0-99d4-2f35bf22129e"), "Cashier" },
                    { new Guid("842372b9-ba3e-4cbc-b37d-0b66299b4b65"), "Manager" }
                });

            migrationBuilder.InsertData(
                table: "Stores",
                columns: new[] { "Id", "Name" },
                values: new object[] { new Guid("3a32efb3-1916-465c-8910-b08382c3b31b"), "My Store" });

            migrationBuilder.InsertData(
                table: "Person",
                columns: new[] { "Id", "Address", "FirstName", "JobTitleId", "LastName", "MaxWeeklyHours", "Password", "Pay", "Phone", "Postal", "Province", "Role", "Username" },
                values: new object[,]
                {
                    { new Guid("ae8b1130-6082-41cb-bcfb-6ecc740d8ee4"), "86479 Harbort Center", "Christel", new Guid("14481991-6bf5-4165-bfbd-2f417fcf1bd0"), "Jobbing", 40, null, 16.96m, "7512327796", "L2V", "Ontario", "FT", null },
                    { new Guid("8c734014-a32a-4e76-ad80-03f82887eeb8"), "33 Dunning Plaza", "Myra", new Guid("842372b9-ba3e-4cbc-b37d-0b66299b4b65"), "Dewane", 40, null, 19.18m, "3184014459", "G9H", "Québec", "FT", null },
                    { new Guid("24741ed0-30ea-4af1-8ef2-e75cd49a28d8"), "13671 Anzinger Hill", "Elvis", new Guid("842372b9-ba3e-4cbc-b37d-0b66299b4b65"), "Birchenhead", 40, null, 14.97m, "4464829827", "J0S", "Québec", "FT", null },
                    { new Guid("ec8bf7a4-894b-44f2-9db9-8a258c7009f4"), "899 Namekagon Point", "Tannie", new Guid("40855ddf-fe2c-44b0-99d4-2f35bf22129e"), "Chantillon", 40, null, 18.4m, "7796457229", "G5N", "Québec", "FT", null },
                    { new Guid("6fbcf408-77a4-44f0-9df5-ef77eaf6a2ff"), "450 Fallview Park", "Bridget", new Guid("40855ddf-fe2c-44b0-99d4-2f35bf22129e"), "Neathway", 15, null, 16.14m, "9741409393", "J3V", "Québec", "PT", null },
                    { new Guid("af2fe745-375b-44b1-87f4-8a7cbe146095"), "452 Eastlawn Street", "Michell", new Guid("40855ddf-fe2c-44b0-99d4-2f35bf22129e"), "McClunaghan", 40, null, 19.96m, "9705140405", "J6A", "Ontario", "FT", null },
                    { new Guid("541d5cd9-409f-4b1c-ac90-0e027b7b4d2d"), "5 Longview Road", "Olympe", new Guid("40855ddf-fe2c-44b0-99d4-2f35bf22129e"), "Roseman", 33, null, 14.32m, "6834047543", "J2K", "Québec", "PT", null },
                    { new Guid("264463f3-8bd6-4ccb-a4ad-ddaf805aea51"), "872 Roxbury Lane", "Aron", new Guid("f25d2bef-c095-432b-adc1-9943bf503834"), "Brayn", 32, null, 17.55m, "3576946796", "L4P", "Ontario", "PT", null },
                    { new Guid("d4b7ced3-d300-4643-928f-800b553ff8c7"), "70226 Evergreen Center", "Bradley", new Guid("f25d2bef-c095-432b-adc1-9943bf503834"), "MacFie", 40, null, 19.53m, "7252174592", "L6E", "Ontario", "FT", null },
                    { new Guid("56043142-2aa5-45af-b287-e0192aecfbca"), "1579 Nancy Crossing", "Engelbert", new Guid("f25d2bef-c095-432b-adc1-9943bf503834"), "Everal", 40, null, 15.34m, "5371747772", "J7J", "Québec", "FT", null },
                    { new Guid("12c8a4c9-985c-4a42-8be8-e909fb704dae"), "7944 Golf View Lane", "Brion", new Guid("f25d2bef-c095-432b-adc1-9943bf503834"), "Quig", 31, null, 14.87m, "1361511879", "N3E", "Manitoba", "PT", null },
                    { new Guid("f1523ace-e1b9-4a01-b0fe-730f66253b1b"), "9 Dahle Circle", "Sophie", new Guid("f25d2bef-c095-432b-adc1-9943bf503834"), "Heller", 9, null, 14.29m, "9497542437", "T5G", "Manitoba", "PT", null },
                    { new Guid("3066f2f7-7820-47f1-aeee-1e5f3b3ca36a"), "71524 Reindahl Drive", "Renaud", new Guid("f25d2bef-c095-432b-adc1-9943bf503834"), "Trott", 16, null, 16.65m, "4111346039", "J8Y", "Ontario", "PT", null },
                    { new Guid("2ebbd7e6-b2ab-4849-b7a2-64c07655b5ef"), "22011 Mosinee Parkway", "Mick", new Guid("f25d2bef-c095-432b-adc1-9943bf503834"), "Neiland", 7, null, 19.27m, "5866251552", "T9H", "Québec", "PT", null },
                    { new Guid("5df1e195-ff42-4835-bb2b-8db7001fd240"), "8262 Coleman Alley", "Cobb", new Guid("f25d2bef-c095-432b-adc1-9943bf503834"), "Dudden", 12, null, 18.88m, "4312540837", "J3Y", "Québec", "PT", null },
                    { new Guid("e6da534d-6fff-40d7-b4ad-06936e2b74c0"), "8889 Milwaukee Way", "Brynna", new Guid("f25d2bef-c095-432b-adc1-9943bf503834"), "Celloni", 40, null, 14.05m, "7981594155", "G6B", "Québec", "FT", null },
                    { new Guid("c75e302e-225c-48e0-bb22-20efb8c98c9f"), "78 Northfield Pass", "Miran", new Guid("14481991-6bf5-4165-bfbd-2f417fcf1bd0"), "MacGauhy", 7, null, 17.15m, "2599076601", "S3N", "Québec", "PT", null },
                    { new Guid("72dc9db9-36d7-437c-a976-99fa0507e825"), "461 Mccormick Place", "Rubin", new Guid("14481991-6bf5-4165-bfbd-2f417fcf1bd0"), "Westwater", 40, null, 16.62m, "2096042736", "G5Z", "Ontario", "FT", null },
                    { new Guid("856b51bb-7df7-4169-a237-fcd5b87526df"), "04662 Porter Lane", "Kai", new Guid("14481991-6bf5-4165-bfbd-2f417fcf1bd0"), "Michelin", 40, null, 14.58m, "7086531921", "L9Y", "Ontario", "FT", null },
                    { new Guid("6ce8898b-2e65-4ed1-a37e-abb6982d962f"), "146 Burrows Trail", "Dael", new Guid("f25d2bef-c095-432b-adc1-9943bf503834"), "Haruard", 32, null, 16.98m, "3214306584", "J0R", "Québec", "PT", null }
                });

            migrationBuilder.InsertData(
                table: "StoreHourLineItems",
                columns: new[] { "Id", "DayId", "StoreId" },
                values: new object[,]
                {
                    { new Guid("f55f053c-76e6-4614-bac6-3e7e1d2c587c"), new Guid("b8655ac8-dc4f-4da2-b192-0b5fd473d4f4"), new Guid("3a32efb3-1916-465c-8910-b08382c3b31b") },
                    { new Guid("2349410e-0e63-4cc0-bc26-46bdc446bf3f"), new Guid("ed405119-0d1a-4442-aef3-60a51a5ec5b4"), new Guid("3a32efb3-1916-465c-8910-b08382c3b31b") },
                    { new Guid("7c6556ce-41e8-411b-9e1d-6c985d5c0dca"), new Guid("30e3944e-803b-4ce6-aee6-dd0cb60dc479"), new Guid("3a32efb3-1916-465c-8910-b08382c3b31b") },
                    { new Guid("06a01eb7-0d3a-4347-bcdf-a4c7180c472d"), new Guid("ada842b0-757d-4118-a84a-c6d296f4d10d"), new Guid("3a32efb3-1916-465c-8910-b08382c3b31b") },
                    { new Guid("45e4bfa1-d1fc-4136-a042-aebe1e0f4822"), new Guid("38e83d67-e75f-48d1-91e0-93f8c877480f"), new Guid("3a32efb3-1916-465c-8910-b08382c3b31b") },
                    { new Guid("1c0dbca9-bf1a-4830-a157-fa641150c286"), new Guid("3cbff644-7d0a-49aa-9431-e69a18963449"), new Guid("3a32efb3-1916-465c-8910-b08382c3b31b") },
                    { new Guid("8dbdc152-da1c-452f-b4db-95a803c37900"), new Guid("b3302c3b-f1df-4097-a1ca-fb3e67e0e972"), new Guid("3a32efb3-1916-465c-8910-b08382c3b31b") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Availabilities_PersonId",
                table: "Availabilities",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_AvailabilityLineItems_AvailabilityId",
                table: "AvailabilityLineItems",
                column: "AvailabilityId");

            migrationBuilder.CreateIndex(
                name: "IX_AvailabilityLineItems_DayId",
                table: "AvailabilityLineItems",
                column: "DayId");

            migrationBuilder.CreateIndex(
                name: "IX_Person_JobTitleId",
                table: "Person",
                column: "JobTitleId");

            migrationBuilder.CreateIndex(
                name: "IX_PersonScheduleLineItems_PersonId",
                table: "PersonScheduleLineItems",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_PersonScheduleLineItems_ScheduleId",
                table: "PersonScheduleLineItems",
                column: "ScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleLineItems_DayId",
                table: "ScheduleLineItems",
                column: "DayId");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleLineItems_ScheduleId",
                table: "ScheduleLineItems",
                column: "ScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleRuleEmpLineItems_JobTitleId",
                table: "ScheduleRuleEmpLineItems",
                column: "JobTitleId");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleRuleEmpLineItems_ScheduleRuleId",
                table: "ScheduleRuleEmpLineItems",
                column: "ScheduleRuleId");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleRules_DayId",
                table: "ScheduleRules",
                column: "DayId");

            migrationBuilder.CreateIndex(
                name: "IX_ShiftChanges_NewPersonId",
                table: "ShiftChanges",
                column: "NewPersonId");

            migrationBuilder.CreateIndex(
                name: "IX_ShiftChanges_ScheduleId",
                table: "ShiftChanges",
                column: "ScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_SickCalls_ScheduleId",
                table: "SickCalls",
                column: "ScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_StoreHourLineItems_DayId",
                table: "StoreHourLineItems",
                column: "DayId");

            migrationBuilder.CreateIndex(
                name: "IX_StoreHourLineItems_StoreId",
                table: "StoreHourLineItems",
                column: "StoreId");

            migrationBuilder.CreateIndex(
                name: "IX_TimeOffLineItems_DayLineItemId",
                table: "TimeOffLineItems",
                column: "DayLineItemId");

            migrationBuilder.CreateIndex(
                name: "IX_TimeOffLineItems_TimeOffId",
                table: "TimeOffLineItems",
                column: "TimeOffId");

            migrationBuilder.CreateIndex(
                name: "IX_TimeOffs_PersonId",
                table: "TimeOffs",
                column: "PersonId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AvailabilityLineItems");

            migrationBuilder.DropTable(
                name: "ScheduleRuleEmpLineItems");

            migrationBuilder.DropTable(
                name: "ShiftChanges");

            migrationBuilder.DropTable(
                name: "SickCalls");

            migrationBuilder.DropTable(
                name: "StoreHourLineItems");

            migrationBuilder.DropTable(
                name: "TimeOffLineItems");

            migrationBuilder.DropTable(
                name: "Availabilities");

            migrationBuilder.DropTable(
                name: "ScheduleRules");

            migrationBuilder.DropTable(
                name: "PersonScheduleLineItems");

            migrationBuilder.DropTable(
                name: "Stores");

            migrationBuilder.DropTable(
                name: "TimeOffs");

            migrationBuilder.DropTable(
                name: "ScheduleLineItems");

            migrationBuilder.DropTable(
                name: "Person");

            migrationBuilder.DropTable(
                name: "DayLineItems");

            migrationBuilder.DropTable(
                name: "Schedules");

            migrationBuilder.DropTable(
                name: "JobTitles");
        }
    }
}
