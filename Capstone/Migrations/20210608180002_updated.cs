using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Capstone.Migrations
{
    public partial class updated : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StoreHourLineItems_DayLineItem_DayId",
                table: "StoreHourLineItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DayLineItem",
                table: "DayLineItem");

            migrationBuilder.RenameTable(
                name: "DayLineItem",
                newName: "DayLineItems");

            migrationBuilder.AlterColumn<int>(
                name: "Day",
                table: "DayLineItems",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_DayLineItems",
                table: "DayLineItems",
                column: "Id");

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
                    Username = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Password = table.Column<string>(type: "longtext", nullable: false)
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

            migrationBuilder.AddForeignKey(
                name: "FK_StoreHourLineItems_DayLineItems_DayId",
                table: "StoreHourLineItems",
                column: "DayId",
                principalTable: "DayLineItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StoreHourLineItems_DayLineItems_DayId",
                table: "StoreHourLineItems");

            migrationBuilder.DropTable(
                name: "AvailabilityLineItems");

            migrationBuilder.DropTable(
                name: "ScheduleRuleEmpLineItems");

            migrationBuilder.DropTable(
                name: "ShiftChanges");

            migrationBuilder.DropTable(
                name: "SickCalls");

            migrationBuilder.DropTable(
                name: "TimeOffLineItems");

            migrationBuilder.DropTable(
                name: "Availabilities");

            migrationBuilder.DropTable(
                name: "ScheduleRules");

            migrationBuilder.DropTable(
                name: "PersonScheduleLineItems");

            migrationBuilder.DropTable(
                name: "TimeOffs");

            migrationBuilder.DropTable(
                name: "ScheduleLineItems");

            migrationBuilder.DropTable(
                name: "Person");

            migrationBuilder.DropTable(
                name: "Schedules");

            migrationBuilder.DropTable(
                name: "JobTitles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DayLineItems",
                table: "DayLineItems");

            migrationBuilder.RenameTable(
                name: "DayLineItems",
                newName: "DayLineItem");

            migrationBuilder.AlterColumn<int>(
                name: "Day",
                table: "DayLineItem",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DayLineItem",
                table: "DayLineItem",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StoreHourLineItems_DayLineItem_DayId",
                table: "StoreHourLineItems",
                column: "DayId",
                principalTable: "DayLineItem",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
