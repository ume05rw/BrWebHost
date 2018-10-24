﻿using Microsoft.EntityFrameworkCore.Migrations;

namespace BroadlinkWeb.Migrations
{
    public partial class ModSeedControlSet : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 1,
                column: "IconUrl",
                value: "images/icons/main_tv.png");

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 2,
                column: "IconUrl",
                value: "images/icons/main_av.png");

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 3,
                column: "IconUrl",
                value: "images/icons/main_light.png");

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 4,
                column: "IconUrl",
                value: "images/icons/main_aircompressor.png");

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 5,
                column: "IconUrl",
                value: "images/icons/main_a1.png");

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 6,
                column: "IconUrl",
                value: "images/icons/main_sp2.png");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 1,
                column: "IconUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 2,
                column: "IconUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 3,
                column: "IconUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 4,
                column: "IconUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 5,
                column: "IconUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 6,
                column: "IconUrl",
                value: null);
        }
    }
}
