using Microsoft.EntityFrameworkCore.Migrations;

namespace BroadlinkWeb.Migrations
{
    public partial class ModIsBrDeviceToControlType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsBrDevice",
                table: "controlsets");

            migrationBuilder.AddColumn<byte>(
                name: "ControlType",
                table: "controlsets",
                type: "tinyint(2)",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 1,
                column: "ControlType",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 2,
                column: "ControlType",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 3,
                column: "ControlType",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 4,
                column: "ControlType",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 5,
                column: "ControlType",
                value: (byte)2);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 6,
                column: "ControlType",
                value: (byte)2);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 7,
                column: "ControlType",
                value: (byte)2);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 8,
                column: "ControlType",
                value: (byte)2);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 9,
                column: "ControlType",
                value: (byte)2);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ControlType",
                table: "controlsets");

            migrationBuilder.AddColumn<byte>(
                name: "IsBrDevice",
                table: "controlsets",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 5,
                column: "IsBrDevice",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 6,
                column: "IsBrDevice",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 7,
                column: "IsBrDevice",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 8,
                column: "IsBrDevice",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 9,
                column: "IsBrDevice",
                value: (byte)1);
        }
    }
}
