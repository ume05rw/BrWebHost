using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BroadlinkWeb.Migrations
{
    public partial class AssServerStatuses : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "serverstatuses",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AvailableWTs = table.Column<int>(nullable: false),
                    AvailableCPTs = table.Column<int>(nullable: false),
                    MaxWTs = table.Column<int>(nullable: false),
                    MaxCPTs = table.Column<int>(nullable: false),
                    ActiveWTs = table.Column<int>(nullable: false),
                    ActiveCPTs = table.Column<int>(nullable: false),
                    WorkingSetSize = table.Column<long>(nullable: false),
                    VirtualMemorySize = table.Column<long>(nullable: false),
                    PagedMemorySize = table.Column<long>(nullable: false),
                    PrivateMemorySize = table.Column<long>(nullable: false),
                    NonpagedSystemMemorySize = table.Column<long>(nullable: false),
                    PagedSystemMemorySize = table.Column<long>(nullable: false),
                    Recorded = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_serverstatuses", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "serverstatuses");
        }
    }
}
