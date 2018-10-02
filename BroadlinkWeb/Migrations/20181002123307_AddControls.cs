using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace BroadlinkWeb.Migrations
{
    public partial class AddControls : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ControlSets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySQL:AutoIncrement", true),
                    BrDeviceId = table.Column<int>(type: "int(11)", nullable: false),
                    Label = table.Column<string>(type: "varchar(50)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ControlSets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ControlSets_BrDevices_BrDeviceId",
                        column: x => x.BrDeviceId,
                        principalTable: "BrDevices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Icons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySQL:AutoIncrement", true),
                    Url = table.Column<string>(type: "varchar(256)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Icons", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Controlls",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySQL:AutoIncrement", true),
                    Code = table.Column<string>(type: "text", nullable: true),
                    Color = table.Column<string>(type: "varchar(8)", nullable: false),
                    ControlSetId = table.Column<int>(type: "int(11)", nullable: false),
                    IconId = table.Column<string>(type: "int(11)", nullable: true),
                    Label = table.Column<string>(type: "varchar(50)", nullable: false),
                    PositionX = table.Column<string>(type: "int(11)", nullable: false),
                    PositionY = table.Column<string>(type: "int(11)", nullable: false),
                    Size = table.Column<string>(type: "int(11)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Controlls", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Controlls_ControlSets_ControlSetId",
                        column: x => x.ControlSetId,
                        principalTable: "ControlSets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Controlls_Icons_IconId",
                        column: x => x.IconId,
                        principalTable: "Icons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Controlls_ControlSetId",
                table: "Controlls",
                column: "ControlSetId");

            migrationBuilder.CreateIndex(
                name: "IX_Controlls_IconId",
                table: "Controlls",
                column: "IconId");

            migrationBuilder.CreateIndex(
                name: "IX_ControlSets_BrDeviceId",
                table: "ControlSets",
                column: "BrDeviceId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Controlls");

            migrationBuilder.DropTable(
                name: "ControlSets");

            migrationBuilder.DropTable(
                name: "Icons");
        }
    }
}
