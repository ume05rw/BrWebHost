using Microsoft.EntityFrameworkCore.Migrations;

namespace BroadlinkWeb.Migrations
{
    public partial class ModColumnsColor : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HoverColor",
                table: "controls");

            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "controlsets",
                type: "varchar(255)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 1,
                column: "Color",
                value: "#fcc91f");

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 2,
                column: "Color",
                value: "#F92068");

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 3,
                column: "Color",
                value: "#ccdc4b");

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 4,
                column: "Color",
                value: "#6545C6");

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 5,
                column: "Color",
                value: "#84bde8");

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 6,
                column: "Color",
                value: "#84bde8");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Color",
                table: "controlsets");

            migrationBuilder.AddColumn<string>(
                name: "HoverColor",
                table: "controls",
                type: "varchar(255)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 1,
                column: "HoverColor",
                value: "#ff538c");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 2,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 3,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 4,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 5,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 6,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 7,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 8,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 9,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 10,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 11,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 12,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 13,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 14,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 15,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 16,
                column: "HoverColor",
                value: "#8fcfff");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 17,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 18,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 19,
                column: "HoverColor",
                value: "#ff538c");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 20,
                column: "HoverColor",
                value: "#8463e6");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 21,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 22,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 23,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 24,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 25,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 26,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 27,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 28,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 29,
                column: "HoverColor",
                value: "#ff538c");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 30,
                column: "HoverColor",
                value: "#8463e6");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 31,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 32,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 33,
                column: "HoverColor",
                value: "#ff538c");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 34,
                column: "HoverColor",
                value: "#8463e6");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 35,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 36,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 37,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 38,
                column: "HoverColor",
                value: "#b4b4b4");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 39,
                column: "HoverColor",
                value: "#ff538c");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 40,
                column: "HoverColor",
                value: "#8fcfff");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 41,
                column: "HoverColor",
                value: "#9bde50");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 42,
                column: "HoverColor",
                value: "#ffd856");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 43,
                column: "HoverColor",
                value: "#d88e4e");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 44,
                column: "HoverColor",
                value: "#ff538c");

            migrationBuilder.UpdateData(
                table: "controls",
                keyColumn: "Id",
                keyValue: 45,
                column: "HoverColor",
                value: "#b4b4b4");
        }
    }
}
