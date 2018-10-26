using Microsoft.EntityFrameworkCore.Migrations;

namespace BroadlinkWeb.Migrations
{
    public partial class UpdateSeeds : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 39,
                column: "Code",
                value: "Temp");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 40,
                column: "Code",
                value: "Humidity");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 41,
                column: "Code",
                value: "Voc");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 42,
                column: "Code",
                value: "Light");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 43,
                column: "Code",
                value: "Noise");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 44,
                column: "Code",
                value: "PowerOn");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 45,
                column: "Code",
                value: "PowerOff");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 46,
                column: "Code",
                value: "LightOn");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 47,
                column: "Code",
                value: "LightOff");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 48,
                column: "Code",
                value: "PowerOn");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 49,
                column: "Code",
                value: "PowerOff");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 50,
                column: "Code",
                value: "Control");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 39,
                column: "Code",
                value: "");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 40,
                column: "Code",
                value: "");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 41,
                column: "Code",
                value: "");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 42,
                column: "Code",
                value: "");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 43,
                column: "Code",
                value: "");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 44,
                column: "Code",
                value: "");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 45,
                column: "Code",
                value: "");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 46,
                column: "Code",
                value: "");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 47,
                column: "Code",
                value: "");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 48,
                column: "Code",
                value: "");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 49,
                column: "Code",
                value: "");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 50,
                column: "Code",
                value: "");
        }
    }
}
