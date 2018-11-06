using Microsoft.EntityFrameworkCore.Migrations;

namespace BroadlinkWeb.Migrations
{
    public partial class AddIconUrlToSchedules : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IconUrl",
                table: "schedules",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IconUrl",
                table: "schedules");
        }
    }
}
