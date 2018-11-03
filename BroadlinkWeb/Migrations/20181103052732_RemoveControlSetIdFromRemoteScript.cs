using Microsoft.EntityFrameworkCore.Migrations;

namespace BroadlinkWeb.Migrations
{
    public partial class RemoveControlSetIdFromRemoteScript : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ControlSetId",
                table: "remotescripts");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ControlSetId",
                table: "remotescripts",
                type: "int(11)",
                nullable: false,
                defaultValue: 0);
        }
    }
}
