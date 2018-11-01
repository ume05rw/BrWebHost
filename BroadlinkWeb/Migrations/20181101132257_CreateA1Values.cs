using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BroadlinkWeb.Migrations
{
    public partial class CreateA1Values : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "a1sensors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySQL:AutoIncrement", true),
                    BrDeviceId = table.Column<int>(type: "int(11)", nullable: true),
                    Temperature = table.Column<decimal>(type: "decimal(5, 2)", nullable: false),
                    Humidity = table.Column<decimal>(type: "decimal(5, 2)", nullable: false),
                    Voc = table.Column<decimal>(type: "decimal(5, 2)", nullable: false),
                    Light = table.Column<decimal>(type: "decimal(5, 2)", nullable: false),
                    Noise = table.Column<decimal>(type: "decimal(5, 2)", nullable: false),
                    Recorded = table.Column<DateTime>(type: "datetime", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime", nullable: false),
                    Updated = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_a1sensors", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "a1sensors");
        }
    }
}
