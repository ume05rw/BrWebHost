using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace BroadlinkWeb.Migrations
{
    public partial class ModBrDevices : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BrDeviceType",
                table: "BrDevices");

            migrationBuilder.AlterColumn<string>(
                name: "IpAddressString",
                table: "BrDevices",
                type: "varchar(20)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(256)");

            migrationBuilder.AddColumn<int>(
                name: "DeviceTypeNumber",
                table: "BrDevices",
                type: "int(6)",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "BrDevices",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "MacAddressString",
                table: "BrDevices",
                type: "varchar(20)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Port",
                table: "BrDevices",
                type: "int(5)",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeviceTypeNumber",
                table: "BrDevices");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "BrDevices");

            migrationBuilder.DropColumn(
                name: "MacAddressString",
                table: "BrDevices");

            migrationBuilder.DropColumn(
                name: "Port",
                table: "BrDevices");

            migrationBuilder.AlterColumn<string>(
                name: "IpAddressString",
                table: "BrDevices",
                type: "varchar(256)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(20)");

            migrationBuilder.AddColumn<string>(
                name: "BrDeviceType",
                table: "BrDevices",
                type: "varchar(50)",
                nullable: false,
                defaultValue: "");
        }
    }
}
