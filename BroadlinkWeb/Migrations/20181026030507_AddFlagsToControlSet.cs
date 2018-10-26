using Microsoft.EntityFrameworkCore.Migrations;

namespace BroadlinkWeb.Migrations
{
    public partial class AddFlagsToControlSet : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte>(
                name: "IsBrDevice",
                table: "controlsets",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.AddColumn<byte>(
                name: "IsMainPanelReady",
                table: "controlsets",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.AddColumn<byte>(
                name: "IsTogglable",
                table: "controlsets",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "IsMainPanelReady", "IsTogglable", "Order" },
                values: new object[] { (byte)1, (byte)1, 99999 });

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "IsMainPanelReady", "IsTogglable", "Order" },
                values: new object[] { (byte)1, (byte)1, 99999 });

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "IsMainPanelReady", "IsTogglable", "Order" },
                values: new object[] { (byte)1, (byte)1, 99999 });

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "IsMainPanelReady", "IsTogglable", "Order" },
                values: new object[] { (byte)1, (byte)1, 99999 });

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "IsBrDevice", "IsMainPanelReady", "Order" },
                values: new object[] { (byte)1, (byte)1, 99999 });

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "IsBrDevice", "IsMainPanelReady", "IsTogglable", "Order" },
                values: new object[] { (byte)1, (byte)1, (byte)1, 99999 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsBrDevice",
                table: "controlsets");

            migrationBuilder.DropColumn(
                name: "IsMainPanelReady",
                table: "controlsets");

            migrationBuilder.DropColumn(
                name: "IsTogglable",
                table: "controlsets");

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 1,
                column: "Order",
                value: 0);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 2,
                column: "Order",
                value: 0);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 3,
                column: "Order",
                value: 0);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 4,
                column: "Order",
                value: 0);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 5,
                column: "Order",
                value: 0);

            migrationBuilder.UpdateData(
                table: "controlsets",
                keyColumn: "Id",
                keyValue: 6,
                column: "Order",
                value: 0);
        }
    }
}
