using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Capstone.Migrations
{
    public partial class changedstoreschema : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StoreHourLineItems_DayLineItems_DayId",
                table: "StoreHourLineItems");

            migrationBuilder.DropForeignKey(
                name: "FK_StoreHourLineItems_StoreHours_StoreHourId",
                table: "StoreHourLineItems");

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("0f86197d-9f64-478a-9afa-7b9ab7efe45b"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("12e02744-4a5c-48bf-9e84-320f3f7a0ce2"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("16f31420-3f3c-425b-8eb7-4c7940ab35df"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("1f45830c-5614-4ae6-af08-bd87b583fec1"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("3a8bd469-bcfc-40da-b77c-4495020f3133"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("59fb091a-afa7-41ea-a05c-e6d904429caf"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("70dadb1c-ef13-4b9e-9472-12364f98177c"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("7658583f-5fb8-4446-806e-b46efd3a81b2"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("76ca8b9b-36f4-4322-a98d-7affcbeb14fc"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("81456073-2e14-4969-9737-90271d3f8c75"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("88c71f3d-1996-4496-9252-aec4d7c0cd9a"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("8ca86232-1534-4d8c-871c-872d4a19d551"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("91781cb8-8e57-429b-afa0-bbf2a50ab17d"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("9a72a098-112a-4865-bbac-ae1139800ae5"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("ad78c009-9c63-4d9b-9d3b-baa2a020ff35"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("d8e42a51-69c9-4936-8e0e-8cd9b01cd6de"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("dedf1fb2-e39a-4f3b-8947-b3fc437dacb1"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("df104d07-71ee-4f7e-8a44-b8e327723f28"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("eed7b862-526a-4755-853d-b8cd5b90dd19"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("f17d73a7-fdc7-4393-a85b-efd629ceae28"));

            migrationBuilder.DeleteData(
                table: "JobTitles",
                keyColumn: "Id",
                keyValue: new Guid("3b7dc549-d2ec-4b96-be4d-db7d556597b7"));

            migrationBuilder.DeleteData(
                table: "JobTitles",
                keyColumn: "Id",
                keyValue: new Guid("a14cebc4-d139-4aff-aa00-dafa650db24c"));

            migrationBuilder.DeleteData(
                table: "JobTitles",
                keyColumn: "Id",
                keyValue: new Guid("ba85b248-b160-494c-9027-7e3f344979a0"));

            migrationBuilder.DeleteData(
                table: "JobTitles",
                keyColumn: "Id",
                keyValue: new Guid("f326dbf1-ea74-40b5-91f6-cbc742e3d294"));

            migrationBuilder.AlterColumn<Guid>(
                name: "StoreHourId",
                table: "StoreHourLineItems",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)",
                oldNullable: true)
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.AlterColumn<Guid>(
                name: "DayId",
                table: "StoreHourLineItems",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)",
                oldNullable: true)
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.InsertData(
                table: "JobTitles",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("30b85d3f-53dc-488b-96ce-f06de7da1acc"), "Stock" },
                    { new Guid("028f3848-ba2c-4fc6-ad86-eba0f099cfd3"), "Sales" },
                    { new Guid("96239770-bee6-4245-9933-3bdb1f9daa81"), "Cashier" },
                    { new Guid("31bbfeb2-c60e-497b-9532-3cf2f90a4939"), "Manager" }
                });

            migrationBuilder.InsertData(
                table: "Person",
                columns: new[] { "Id", "Address", "FirstName", "JobTitleId", "LastName", "MaxWeeklyHours", "Password", "Pay", "Phone", "Postal", "Province", "Role", "Username" },
                values: new object[,]
                {
                    { new Guid("65b78c81-aab1-43f8-8c1f-aae73ec7e71b"), "86479 Harbort Center", "Christel", new Guid("30b85d3f-53dc-488b-96ce-f06de7da1acc"), "Jobbing", 40, null, 16.96m, "7512327796", "L2V", "Ontario", "FT", null },
                    { new Guid("c188ca55-4d8d-4fdc-8581-ef8fee04fea7"), "899 Namekagon Point", "Tannie", new Guid("96239770-bee6-4245-9933-3bdb1f9daa81"), "Chantillon", 40, null, 18.4m, "7796457229", "G5N", "Québec", "FT", null },
                    { new Guid("cbe92f79-aec3-456b-94b2-fea7932c9b0d"), "450 Fallview Park", "Bridget", new Guid("96239770-bee6-4245-9933-3bdb1f9daa81"), "Neathway", 15, null, 16.14m, "9741409393", "J3V", "Québec", "PT", null },
                    { new Guid("6a7898c7-4480-4c6c-a6da-8b4ccadb1f85"), "452 Eastlawn Street", "Michell", new Guid("96239770-bee6-4245-9933-3bdb1f9daa81"), "McClunaghan", 40, null, 19.96m, "9705140405", "J6A", "Ontario", "FT", null },
                    { new Guid("067fedcd-e35f-4560-8e4f-6d228bed9284"), "5 Longview Road", "Olympe", new Guid("96239770-bee6-4245-9933-3bdb1f9daa81"), "Roseman", 33, null, 14.32m, "6834047543", "J2K", "Québec", "PT", null },
                    { new Guid("6737b054-4f06-4f7d-baa6-e22f704ef53f"), "7944 Golf View Lane", "Brion", new Guid("028f3848-ba2c-4fc6-ad86-eba0f099cfd3"), "Quig", 31, null, 14.87m, "1361511879", "N3E", "Manitoba", "PT", null },
                    { new Guid("10a96f6f-ab1a-452d-b312-57dde459ca14"), "872 Roxbury Lane", "Aron", new Guid("028f3848-ba2c-4fc6-ad86-eba0f099cfd3"), "Brayn", 32, null, 17.55m, "3576946796", "L4P", "Ontario", "PT", null },
                    { new Guid("6ed84f79-8f11-4504-91cd-213755423ad8"), "70226 Evergreen Center", "Bradley", new Guid("028f3848-ba2c-4fc6-ad86-eba0f099cfd3"), "MacFie", 40, null, 19.53m, "7252174592", "L6E", "Ontario", "FT", null },
                    { new Guid("28588be2-1c43-4617-aa71-bba63f5de9c3"), "1579 Nancy Crossing", "Engelbert", new Guid("028f3848-ba2c-4fc6-ad86-eba0f099cfd3"), "Everal", 40, null, 15.34m, "5371747772", "J7J", "Québec", "FT", null },
                    { new Guid("44fe9f3b-c8bb-4bf8-b858-35125a09670a"), "146 Burrows Trail", "Dael", new Guid("028f3848-ba2c-4fc6-ad86-eba0f099cfd3"), "Haruard", 32, null, 16.98m, "3214306584", "J0R", "Québec", "PT", null },
                    { new Guid("17261168-6f9c-4db4-a6b8-2bdeb227339b"), "9 Dahle Circle", "Sophie", new Guid("028f3848-ba2c-4fc6-ad86-eba0f099cfd3"), "Heller", 9, null, 14.29m, "9497542437", "T5G", "Manitoba", "PT", null },
                    { new Guid("05c3ab16-57e1-4dae-bb29-270941045529"), "71524 Reindahl Drive", "Renaud", new Guid("028f3848-ba2c-4fc6-ad86-eba0f099cfd3"), "Trott", 16, null, 16.65m, "4111346039", "J8Y", "Ontario", "PT", null },
                    { new Guid("c6628c92-8bed-4d53-a374-66f1edde67ec"), "22011 Mosinee Parkway", "Mick", new Guid("028f3848-ba2c-4fc6-ad86-eba0f099cfd3"), "Neiland", 7, null, 19.27m, "5866251552", "T9H", "Québec", "PT", null },
                    { new Guid("bbf290bd-e028-4405-8323-f9985bb8db0c"), "8262 Coleman Alley", "Cobb", new Guid("028f3848-ba2c-4fc6-ad86-eba0f099cfd3"), "Dudden", 12, null, 18.88m, "4312540837", "J3Y", "Québec", "PT", null },
                    { new Guid("08dbe323-63bf-4dd7-aa01-471ba5eb0897"), "8889 Milwaukee Way", "Brynna", new Guid("028f3848-ba2c-4fc6-ad86-eba0f099cfd3"), "Celloni", 40, null, 14.05m, "7981594155", "G6B", "Québec", "FT", null },
                    { new Guid("7c4dad28-c081-4412-b158-7e619a3c461c"), "78 Northfield Pass", "Miran", new Guid("30b85d3f-53dc-488b-96ce-f06de7da1acc"), "MacGauhy", 7, null, 17.15m, "2599076601", "S3N", "Québec", "PT", null },
                    { new Guid("5a07b0eb-2e7f-406a-b3f6-b1b8f93f58af"), "461 Mccormick Place", "Rubin", new Guid("30b85d3f-53dc-488b-96ce-f06de7da1acc"), "Westwater", 40, null, 16.62m, "2096042736", "G5Z", "Ontario", "FT", null },
                    { new Guid("b521fc2e-b060-4d3d-aca7-75bf9ca814d2"), "04662 Porter Lane", "Kai", new Guid("30b85d3f-53dc-488b-96ce-f06de7da1acc"), "Michelin", 40, null, 14.58m, "7086531921", "L9Y", "Ontario", "FT", null },
                    { new Guid("4201ed78-d99f-4c02-a3de-e8e69085038b"), "13671 Anzinger Hill", "Elvis", new Guid("31bbfeb2-c60e-497b-9532-3cf2f90a4939"), "Birchenhead", 40, null, 14.97m, "4464829827", "J0S", "Québec", "FT", null },
                    { new Guid("c89dd530-1f08-4306-acf6-f2c7728ee909"), "33 Dunning Plaza", "Myra", new Guid("31bbfeb2-c60e-497b-9532-3cf2f90a4939"), "Dewane", 40, null, 19.18m, "3184014459", "G9H", "Québec", "FT", null }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_StoreHourLineItems_DayLineItems_DayId",
                table: "StoreHourLineItems",
                column: "DayId",
                principalTable: "DayLineItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StoreHourLineItems_StoreHours_StoreHourId",
                table: "StoreHourLineItems",
                column: "StoreHourId",
                principalTable: "StoreHours",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StoreHourLineItems_DayLineItems_DayId",
                table: "StoreHourLineItems");

            migrationBuilder.DropForeignKey(
                name: "FK_StoreHourLineItems_StoreHours_StoreHourId",
                table: "StoreHourLineItems");

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("05c3ab16-57e1-4dae-bb29-270941045529"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("067fedcd-e35f-4560-8e4f-6d228bed9284"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("08dbe323-63bf-4dd7-aa01-471ba5eb0897"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("10a96f6f-ab1a-452d-b312-57dde459ca14"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("17261168-6f9c-4db4-a6b8-2bdeb227339b"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("28588be2-1c43-4617-aa71-bba63f5de9c3"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("4201ed78-d99f-4c02-a3de-e8e69085038b"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("44fe9f3b-c8bb-4bf8-b858-35125a09670a"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("5a07b0eb-2e7f-406a-b3f6-b1b8f93f58af"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("65b78c81-aab1-43f8-8c1f-aae73ec7e71b"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("6737b054-4f06-4f7d-baa6-e22f704ef53f"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("6a7898c7-4480-4c6c-a6da-8b4ccadb1f85"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("6ed84f79-8f11-4504-91cd-213755423ad8"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("7c4dad28-c081-4412-b158-7e619a3c461c"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("b521fc2e-b060-4d3d-aca7-75bf9ca814d2"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("bbf290bd-e028-4405-8323-f9985bb8db0c"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("c188ca55-4d8d-4fdc-8581-ef8fee04fea7"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("c6628c92-8bed-4d53-a374-66f1edde67ec"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("c89dd530-1f08-4306-acf6-f2c7728ee909"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("cbe92f79-aec3-456b-94b2-fea7932c9b0d"));

            migrationBuilder.DeleteData(
                table: "JobTitles",
                keyColumn: "Id",
                keyValue: new Guid("028f3848-ba2c-4fc6-ad86-eba0f099cfd3"));

            migrationBuilder.DeleteData(
                table: "JobTitles",
                keyColumn: "Id",
                keyValue: new Guid("30b85d3f-53dc-488b-96ce-f06de7da1acc"));

            migrationBuilder.DeleteData(
                table: "JobTitles",
                keyColumn: "Id",
                keyValue: new Guid("31bbfeb2-c60e-497b-9532-3cf2f90a4939"));

            migrationBuilder.DeleteData(
                table: "JobTitles",
                keyColumn: "Id",
                keyValue: new Guid("96239770-bee6-4245-9933-3bdb1f9daa81"));

            migrationBuilder.AlterColumn<Guid>(
                name: "StoreHourId",
                table: "StoreHourLineItems",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)")
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.AlterColumn<Guid>(
                name: "DayId",
                table: "StoreHourLineItems",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)")
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.InsertData(
                table: "JobTitles",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("3b7dc549-d2ec-4b96-be4d-db7d556597b7"), "Stock" },
                    { new Guid("ba85b248-b160-494c-9027-7e3f344979a0"), "Sales" },
                    { new Guid("f326dbf1-ea74-40b5-91f6-cbc742e3d294"), "Cashier" },
                    { new Guid("a14cebc4-d139-4aff-aa00-dafa650db24c"), "Manager" }
                });

            migrationBuilder.InsertData(
                table: "Person",
                columns: new[] { "Id", "Address", "FirstName", "JobTitleId", "LastName", "MaxWeeklyHours", "Password", "Pay", "Phone", "Postal", "Province", "Role", "Username" },
                values: new object[,]
                {
                    { new Guid("f17d73a7-fdc7-4393-a85b-efd629ceae28"), "86479 Harbort Center", "Christel", new Guid("3b7dc549-d2ec-4b96-be4d-db7d556597b7"), "Jobbing", 40, null, 16.96m, "7512327796", "L2V", "Ontario", "FT", null },
                    { new Guid("0f86197d-9f64-478a-9afa-7b9ab7efe45b"), "899 Namekagon Point", "Tannie", new Guid("f326dbf1-ea74-40b5-91f6-cbc742e3d294"), "Chantillon", 40, null, 18.4m, "7796457229", "G5N", "Québec", "FT", null },
                    { new Guid("91781cb8-8e57-429b-afa0-bbf2a50ab17d"), "450 Fallview Park", "Bridget", new Guid("f326dbf1-ea74-40b5-91f6-cbc742e3d294"), "Neathway", 15, null, 16.14m, "9741409393", "J3V", "Québec", "PT", null },
                    { new Guid("81456073-2e14-4969-9737-90271d3f8c75"), "452 Eastlawn Street", "Michell", new Guid("f326dbf1-ea74-40b5-91f6-cbc742e3d294"), "McClunaghan", 40, null, 19.96m, "9705140405", "J6A", "Ontario", "FT", null },
                    { new Guid("76ca8b9b-36f4-4322-a98d-7affcbeb14fc"), "5 Longview Road", "Olympe", new Guid("f326dbf1-ea74-40b5-91f6-cbc742e3d294"), "Roseman", 33, null, 14.32m, "6834047543", "J2K", "Québec", "PT", null },
                    { new Guid("12e02744-4a5c-48bf-9e84-320f3f7a0ce2"), "7944 Golf View Lane", "Brion", new Guid("ba85b248-b160-494c-9027-7e3f344979a0"), "Quig", 31, null, 14.87m, "1361511879", "N3E", "Manitoba", "PT", null },
                    { new Guid("ad78c009-9c63-4d9b-9d3b-baa2a020ff35"), "872 Roxbury Lane", "Aron", new Guid("ba85b248-b160-494c-9027-7e3f344979a0"), "Brayn", 32, null, 17.55m, "3576946796", "L4P", "Ontario", "PT", null },
                    { new Guid("88c71f3d-1996-4496-9252-aec4d7c0cd9a"), "70226 Evergreen Center", "Bradley", new Guid("ba85b248-b160-494c-9027-7e3f344979a0"), "MacFie", 40, null, 19.53m, "7252174592", "L6E", "Ontario", "FT", null },
                    { new Guid("70dadb1c-ef13-4b9e-9472-12364f98177c"), "1579 Nancy Crossing", "Engelbert", new Guid("ba85b248-b160-494c-9027-7e3f344979a0"), "Everal", 40, null, 15.34m, "5371747772", "J7J", "Québec", "FT", null },
                    { new Guid("d8e42a51-69c9-4936-8e0e-8cd9b01cd6de"), "146 Burrows Trail", "Dael", new Guid("ba85b248-b160-494c-9027-7e3f344979a0"), "Haruard", 32, null, 16.98m, "3214306584", "J0R", "Québec", "PT", null },
                    { new Guid("16f31420-3f3c-425b-8eb7-4c7940ab35df"), "9 Dahle Circle", "Sophie", new Guid("ba85b248-b160-494c-9027-7e3f344979a0"), "Heller", 9, null, 14.29m, "9497542437", "T5G", "Manitoba", "PT", null },
                    { new Guid("9a72a098-112a-4865-bbac-ae1139800ae5"), "71524 Reindahl Drive", "Renaud", new Guid("ba85b248-b160-494c-9027-7e3f344979a0"), "Trott", 16, null, 16.65m, "4111346039", "J8Y", "Ontario", "PT", null },
                    { new Guid("59fb091a-afa7-41ea-a05c-e6d904429caf"), "22011 Mosinee Parkway", "Mick", new Guid("ba85b248-b160-494c-9027-7e3f344979a0"), "Neiland", 7, null, 19.27m, "5866251552", "T9H", "Québec", "PT", null },
                    { new Guid("dedf1fb2-e39a-4f3b-8947-b3fc437dacb1"), "8262 Coleman Alley", "Cobb", new Guid("ba85b248-b160-494c-9027-7e3f344979a0"), "Dudden", 12, null, 18.88m, "4312540837", "J3Y", "Québec", "PT", null },
                    { new Guid("eed7b862-526a-4755-853d-b8cd5b90dd19"), "8889 Milwaukee Way", "Brynna", new Guid("ba85b248-b160-494c-9027-7e3f344979a0"), "Celloni", 40, null, 14.05m, "7981594155", "G6B", "Québec", "FT", null },
                    { new Guid("7658583f-5fb8-4446-806e-b46efd3a81b2"), "78 Northfield Pass", "Miran", new Guid("3b7dc549-d2ec-4b96-be4d-db7d556597b7"), "MacGauhy", 7, null, 17.15m, "2599076601", "S3N", "Québec", "PT", null },
                    { new Guid("1f45830c-5614-4ae6-af08-bd87b583fec1"), "461 Mccormick Place", "Rubin", new Guid("3b7dc549-d2ec-4b96-be4d-db7d556597b7"), "Westwater", 40, null, 16.62m, "2096042736", "G5Z", "Ontario", "FT", null },
                    { new Guid("3a8bd469-bcfc-40da-b77c-4495020f3133"), "04662 Porter Lane", "Kai", new Guid("3b7dc549-d2ec-4b96-be4d-db7d556597b7"), "Michelin", 40, null, 14.58m, "7086531921", "L9Y", "Ontario", "FT", null },
                    { new Guid("df104d07-71ee-4f7e-8a44-b8e327723f28"), "13671 Anzinger Hill", "Elvis", new Guid("a14cebc4-d139-4aff-aa00-dafa650db24c"), "Birchenhead", 40, null, 14.97m, "4464829827", "J0S", "Québec", "FT", null },
                    { new Guid("8ca86232-1534-4d8c-871c-872d4a19d551"), "33 Dunning Plaza", "Myra", new Guid("a14cebc4-d139-4aff-aa00-dafa650db24c"), "Dewane", 40, null, 19.18m, "3184014459", "G9H", "Québec", "FT", null }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_StoreHourLineItems_DayLineItems_DayId",
                table: "StoreHourLineItems",
                column: "DayId",
                principalTable: "DayLineItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StoreHourLineItems_StoreHours_StoreHourId",
                table: "StoreHourLineItems",
                column: "StoreHourId",
                principalTable: "StoreHours",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
