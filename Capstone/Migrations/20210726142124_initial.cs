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
                    Day = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Start = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    End = table.Column<DateTime>(type: "datetime(6)", nullable: false)
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
                name: "StoreHours",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    StoreId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StoreHours", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StoreHours_Stores_StoreId",
                        column: x => x.StoreId,
                        principalTable: "Stores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
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
                name: "StoreHourLineItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    StoreHourId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    DayId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StoreHourLineItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StoreHourLineItems_DayLineItems_DayId",
                        column: x => x.DayId,
                        principalTable: "DayLineItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StoreHourLineItems_StoreHours_StoreHourId",
                        column: x => x.StoreHourId,
                        principalTable: "StoreHours",
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
                table: "Person",
                columns: new[] { "Id", "Address", "FirstName", "JobTitleId", "LastName", "MaxWeeklyHours", "Password", "Pay", "Phone", "Postal", "Province", "Role", "Username" },
                values: new object[,]
                {
                    { new Guid("55d3ac1b-0489-4d48-b7d8-f64ebc35dba9"), "8889 Milwaukee Way", "Brynna", null, "Celloni", 40, null, 14.05m, "7981594155", "G6B", "Québec", "FT", null },
                    { new Guid("053572ef-9506-42be-9f81-c90e251b1c6c"), "899 Namekagon Point", "Tannie", null, "Chantillon", 40, null, 18.4m, "7796457229", "G5N", "Québec", "FT", null },
                    { new Guid("80cf5eab-7936-4cb4-b512-663e00459c92"), "450 Fallview Park", "Bridget", null, "Neathway", 15, null, 16.14m, "9741409393", "J3V", "Québec", "PT", null },
                    { new Guid("b104b2aa-56f6-44fb-bba9-159a74aabec6"), "452 Eastlawn Street", "Michell", null, "McClunaghan", 40, null, 19.96m, "9705140405", "J6A", "Ontario", "FT", null },
                    { new Guid("b140daf2-edae-44ae-9414-30f162dcb58a"), "5 Longview Road", "Olympe", null, "Roseman", 33, null, 14.32m, "6834047543", "J2K", "Québec", "PT", null },
                    { new Guid("9d64f9b9-1df2-461f-9e8a-1d4d53432560"), "78 Northfield Pass", "Miran", null, "MacGauhy", 7, null, 17.15m, "2599076601", "S3N", "Québec", "PT", null },
                    { new Guid("949499ee-ba27-440b-8aa5-41c3522e20e2"), "461 Mccormick Place", "Rubin", null, "Westwater", 40, null, 16.62m, "2096042736", "G5Z", "Ontario", "FT", null },
                    { new Guid("b68576a8-cd0a-4d58-b82b-70b2aae9555b"), "04662 Porter Lane", "Kai", null, "Michelin", 40, null, 14.58m, "7086531921", "L9Y", "Ontario", "FT", null },
                    { new Guid("91b94ec4-e244-45bd-a847-bb469fd750e2"), "86479 Harbort Center", "Christel", null, "Jobbing", 40, null, 16.96m, "7512327796", "L2V", "Ontario", "FT", null },
                    { new Guid("68eaba53-35d4-4da0-88c4-46fdd01c53ff"), "7944 Golf View Lane", "Brion", null, "Quig", 31, null, 14.87m, "1361511879", "N3E", "Manitoba", "PT", null },
                    { new Guid("f7d198c4-3798-4da2-a97c-8ca003d8cd3a"), "872 Roxbury Lane", "Aron", null, "Brayn", 32, null, 17.55m, "3576946796", "L4P", "Ontario", "PT", null },
                    { new Guid("eda07ec8-99b1-4532-a450-1c13caa2ba73"), "70226 Evergreen Center", "Bradley", null, "MacFie", 40, null, 19.53m, "7252174592", "L6E", "Ontario", "FT", null },
                    { new Guid("7b232974-27df-4ecb-a7e7-239cff4925d6"), "1579 Nancy Crossing", "Engelbert", null, "Everal", 40, null, 15.34m, "5371747772", "J7J", "Québec", "FT", null },
                    { new Guid("e684c3a6-7eb1-4a27-8446-23870b4d3dba"), "146 Burrows Trail", "Dael", null, "Haruard", 32, null, 16.98m, "3214306584", "J0R", "Québec", "PT", null },
                    { new Guid("f3e069af-0177-4e36-a52d-b9454ffd0e99"), "9 Dahle Circle", "Sophie", null, "Heller", 9, null, 14.29m, "9497542437", "T5G", "Manitoba", "PT", null },
                    { new Guid("a5488e46-cfac-4d27-b395-590394ad0995"), "71524 Reindahl Drive", "Renaud", null, "Trott", 16, null, 16.65m, "4111346039", "J8Y", "Ontario", "PT", null },
                    { new Guid("cbf7b071-87ef-47b9-adf7-808232b07f8f"), "22011 Mosinee Parkway", "Mick", null, "Neiland", 7, null, 19.27m, "5866251552", "T9H", "Québec", "PT", null },
                    { new Guid("243c4bcc-56a6-469f-bb48-1dc7a70c1181"), "8262 Coleman Alley", "Cobb", null, "Dudden", 12, null, 18.88m, "4312540837", "J3Y", "Québec", "PT", null },
                    { new Guid("bc6eadb8-4df5-4118-b813-eaba519f8873"), "13671 Anzinger Hill", "Elvis", null, "Birchenhead", 40, null, 14.97m, "4464829827", "J0S", "Québec", "FT", null },
                    { new Guid("3d498699-5170-4324-a682-c67b37f6fce0"), "33 Dunning Plaza", "Myra", null, "Dewane", 40, null, 19.18m, "3184014459", "G9H", "Québec", "FT", null }
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
                name: "IX_StoreHourLineItems_StoreHourId",
                table: "StoreHourLineItems",
                column: "StoreHourId");

            migrationBuilder.CreateIndex(
                name: "IX_StoreHours_StoreId",
                table: "StoreHours",
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
                name: "StoreHours");

            migrationBuilder.DropTable(
                name: "TimeOffs");

            migrationBuilder.DropTable(
                name: "ScheduleLineItems");

            migrationBuilder.DropTable(
                name: "Stores");

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
