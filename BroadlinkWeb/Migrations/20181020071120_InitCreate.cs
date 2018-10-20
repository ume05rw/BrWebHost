using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace BroadlinkWeb.Migrations
{
    public partial class InitCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "brdevices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySQL:AutoIncrement", true),
                    DeviceTypeDetailNumber = table.Column<int>(type: "int(6)", nullable: false),
                    IpAddressString = table.Column<string>(type: "varchar(20)", nullable: false),
                    MacAddressString = table.Column<string>(type: "varchar(20)", nullable: false),
                    Port = table.Column<int>(type: "int(5)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_brdevices", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "controlsets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySQL:AutoIncrement", true),
                    BrDeviceId = table.Column<int>(type: "int(11)", nullable: true),
                    Name = table.Column<string>(type: "varchar(50)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_controlsets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_controlsets_brdevices_BrDeviceId",
                        column: x => x.BrDeviceId,
                        principalTable: "brdevices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "controls",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySQL:AutoIncrement", true),
                    Code = table.Column<string>(type: "text", nullable: true),
                    Color = table.Column<string>(type: "varchar(255)", nullable: false),
                    ControlSetId = table.Column<int>(type: "int(11)", nullable: false),
                    HoverColor = table.Column<string>(type: "varchar(255)", nullable: false),
                    IconUrl = table.Column<string>(type: "varchar(255)", nullable: true),
                    IsAssignToggleOff = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IsAssignToggleOn = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Name = table.Column<string>(type: "varchar(50)", nullable: false),
                    PositionLeft = table.Column<string>(type: "int(11)", nullable: false),
                    PositionTop = table.Column<string>(type: "int(11)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_controls", x => x.Id);
                    table.ForeignKey(
                        name: "FK_controls_controlsets_ControlSetId",
                        column: x => x.ControlSetId,
                        principalTable: "controlsets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_controls_ControlSetId",
                table: "controls",
                column: "ControlSetId");

            migrationBuilder.CreateIndex(
                name: "IX_controlsets_BrDeviceId",
                table: "controlsets",
                column: "BrDeviceId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "controls");

            migrationBuilder.DropTable(
                name: "controlsets");

            migrationBuilder.DropTable(
                name: "brdevices");
        }
    }
}
