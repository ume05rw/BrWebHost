using Microsoft.EntityFrameworkCore.Migrations;

namespace BroadlinkWeb.Migrations
{
    public partial class CreateRemoteScriptsTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "remotescripts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySQL:AutoIncrement", true),
                    RemoteHostId = table.Column<int>(type: "int(11)", nullable: false),
                    ControlSetId = table.Column<int>(type: "int(11)", nullable: false),
                    ControlId = table.Column<int>(type: "int(11)", nullable: false),
                    Name = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_remotescripts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_remotescripts_remotehost_RemoteHostId",
                        column: x => x.RemoteHostId,
                        principalTable: "remotehost",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_remotescripts_RemoteHostId",
                table: "remotescripts",
                column: "RemoteHostId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "remotescripts");
        }
    }
}
