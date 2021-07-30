using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Capstone.Migrations
{
    public partial class addjobtitle : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("053572ef-9506-42be-9f81-c90e251b1c6c"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("243c4bcc-56a6-469f-bb48-1dc7a70c1181"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("3d498699-5170-4324-a682-c67b37f6fce0"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("55d3ac1b-0489-4d48-b7d8-f64ebc35dba9"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("68eaba53-35d4-4da0-88c4-46fdd01c53ff"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("7b232974-27df-4ecb-a7e7-239cff4925d6"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("80cf5eab-7936-4cb4-b512-663e00459c92"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("91b94ec4-e244-45bd-a847-bb469fd750e2"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("949499ee-ba27-440b-8aa5-41c3522e20e2"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("9d64f9b9-1df2-461f-9e8a-1d4d53432560"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("a5488e46-cfac-4d27-b395-590394ad0995"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("b104b2aa-56f6-44fb-bba9-159a74aabec6"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("b140daf2-edae-44ae-9414-30f162dcb58a"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("b68576a8-cd0a-4d58-b82b-70b2aae9555b"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("bc6eadb8-4df5-4118-b813-eaba519f8873"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("cbf7b071-87ef-47b9-adf7-808232b07f8f"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("e684c3a6-7eb1-4a27-8446-23870b4d3dba"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("eda07ec8-99b1-4532-a450-1c13caa2ba73"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("f3e069af-0177-4e36-a52d-b9454ffd0e99"));

            migrationBuilder.DeleteData(
                table: "Person",
                keyColumn: "Id",
                keyValue: new Guid("f7d198c4-3798-4da2-a97c-8ca003d8cd3a"));

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
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
        }
    }
}
