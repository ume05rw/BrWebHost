using Microsoft.EntityFrameworkCore.Migrations;

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
                    MacAddressString = table.Column<string>(type: "varchar(20)", nullable: false),
                    IpAddressString = table.Column<string>(type: "varchar(20)", nullable: false),
                    Port = table.Column<int>(type: "int(5)", nullable: false),
                    DeviceTypeDetailNumber = table.Column<int>(type: "int(6)", nullable: false)
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
                    Name = table.Column<string>(type: "varchar(50)", nullable: true),
                    BrDeviceId = table.Column<int>(type: "int(11)", nullable: true),
                    IsTemplate = table.Column<byte>(type: "tinyint(1)", nullable: false)
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
                    ControlSetId = table.Column<int>(type: "int(11)", nullable: false),
                    Name = table.Column<string>(type: "varchar(50)", nullable: true),
                    PositionLeft = table.Column<int>(type: "int(11)", nullable: false),
                    PositionTop = table.Column<int>(type: "int(11)", nullable: false),
                    Color = table.Column<string>(type: "varchar(255)", nullable: false),
                    HoverColor = table.Column<string>(type: "varchar(255)", nullable: false),
                    IconUrl = table.Column<string>(type: "varchar(255)", nullable: true),
                    Code = table.Column<string>(type: "text", nullable: true),
                    IsAssignToggleOn = table.Column<byte>(type: "tinyint(1)", nullable: false),
                    IsAssignToggleOff = table.Column<byte>(type: "tinyint(1)", nullable: false)
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

            migrationBuilder.InsertData(
                table: "controlsets",
                columns: new[] { "Id", "BrDeviceId", "IsTemplate", "Name" },
                values: new object[,]
                {
                    { 1, null, (byte)1, "TV" },
                    { 2, null, (byte)1, "AV" },
                    { 3, null, (byte)1, "Light" },
                    { 4, null, (byte)1, "Air Complessor" },
                    { 5, null, (byte)1, "A1 Sensor" },
                    { 6, null, (byte)1, "Sp2 Switch" }
                });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "HoverColor", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[,]
                {
                    { 1, "", "#F92068", 1, "#ff538c", "images/icons/power.png", (byte)1, (byte)1, "Power", 185, 5 },
                    { 25, "", "#9d9e9e", 2, "#b4b4b4", "images/icons/circle_play.png", (byte)0, (byte)0, "Play", 95, 275 },
                    { 26, "", "#9d9e9e", 2, "#b4b4b4", "images/icons/darrow_right.png", (byte)0, (byte)0, "Next", 185, 365 },
                    { 27, "", "#9d9e9e", 2, "#b4b4b4", "images/icons/darrow_left.png", (byte)0, (byte)0, "Prev", 5, 365 },
                    { 28, "", "#9d9e9e", 2, "#b4b4b4", "images/icons/circle_pause.png", (byte)0, (byte)0, "Pause", 95, 365 },
                    { 29, "", "#F92068", 3, "#ff538c", "images/icons/power.png", (byte)0, (byte)1, "Power On", 5, 5 },
                    { 30, "", "#6545C6", 3, "#8463e6", "images/icons/moon.png", (byte)1, (byte)0, "Power Off", 185, 5 },
                    { 31, "", "#9d9e9e", 3, "#b4b4b4", "images/icons/arrow2_up.png", (byte)0, (byte)0, "Up", 95, 95 },
                    { 32, "", "#9d9e9e", 3, "#b4b4b4", "images/icons/arrow2_down.png", (byte)0, (byte)0, "Down", 95, 185 },
                    { 33, "", "#F92068", 4, "#ff538c", "images/icons/power.png", (byte)0, (byte)1, "Power On", 5, 5 },
                    { 34, "", "#6545C6", 4, "#8463e6", "images/icons/moon.png", (byte)1, (byte)0, "Power Off", 185, 5 },
                    { 35, "", "#9d9e9e", 4, "#b4b4b4", "", (byte)0, (byte)0, "Temp.", 95, 95 },
                    { 36, "", "#9d9e9e", 4, "#b4b4b4", "images/icons/settings2.png", (byte)0, (byte)0, "Select", 5, 185 },
                    { 37, "", "#9d9e9e", 4, "#b4b4b4", "images/icons/arrow2_up.png", (byte)0, (byte)0, "Up", 185, 95 },
                    { 38, "", "#9d9e9e", 4, "#b4b4b4", "images/icons/arrow2_down.png", (byte)0, (byte)0, "Down", 185, 185 },
                    { 39, "", "#F92068", 5, "#ff538c", "", (byte)0, (byte)0, "Temp.", 185, 5 },
                    { 40, "", "#84bde8", 5, "#8fcfff", "", (byte)0, (byte)0, "Humidity", 5, 5 },
                    { 41, "", "#81c03b", 5, "#9bde50", "", (byte)0, (byte)0, "VOC", 95, 95 },
                    { 42, "", "#fcc91f", 5, "#ffd856", "", (byte)0, (byte)0, "Light", 5, 185 },
                    { 43, "", "#B5743B", 5, "#d88e4e", "", (byte)0, (byte)0, "Noise", 185, 185 },
                    { 24, "", "#9d9e9e", 2, "#b4b4b4", "images/icons/arrow2_down.png", (byte)0, (byte)0, "Ch.Down", 185, 185 },
                    { 44, "", "#F92068", 6, "#ff538c", "", (byte)0, (byte)0, "Power", 95, 5 },
                    { 23, "", "#9d9e9e", 2, "#b4b4b4", "images/icons/arrow2_up.png", (byte)0, (byte)0, "Ch.Up", 185, 95 },
                    { 21, "", "#9d9e9e", 2, "#b4b4b4", "images/icons/circle_plus.png", (byte)0, (byte)0, "Vol.Up", 5, 95 },
                    { 2, "", "#9d9e9e", 1, "#b4b4b4", "images/icons/num_0.png", (byte)0, (byte)0, "Ch.0", 95, 545 },
                    { 3, "", "#9d9e9e", 1, "#b4b4b4", "images/icons/num_9.png", (byte)0, (byte)0, "Ch.9", 185, 455 },
                    { 4, "", "#9d9e9e", 1, "#b4b4b4", "images/icons/num_8.png", (byte)0, (byte)0, "Ch.8", 95, 455 },
                    { 5, "", "#9d9e9e", 1, "#b4b4b4", "images/icons/num_7.png", (byte)0, (byte)0, "Ch.7", 5, 455 },
                    { 6, "", "#9d9e9e", 1, "#b4b4b4", "images/icons/num_6.png", (byte)0, (byte)0, "Ch.6", 185, 365 },
                    { 7, "", "#9d9e9e", 1, "#b4b4b4", "images/icons/num_5.png", (byte)0, (byte)0, "Ch.5", 95, 365 },
                    { 8, "", "#9d9e9e", 1, "#b4b4b4", "images/icons/num_4.png", (byte)0, (byte)0, "Ch.4", 5, 365 },
                    { 9, "", "#9d9e9e", 1, "#b4b4b4", "images/icons/num_3.png", (byte)0, (byte)0, "Ch.3", 185, 275 },
                    { 10, "", "#9d9e9e", 1, "#b4b4b4", "images/icons/num_2.png", (byte)0, (byte)0, "Ch.2", 95, 275 },
                    { 11, "", "#9d9e9e", 1, "#b4b4b4", "images/icons/num_1.png", (byte)0, (byte)0, "Ch.1", 5, 275 },
                    { 12, "", "#9d9e9e", 1, "#b4b4b4", "images/icons/circle_minus.png", (byte)0, (byte)0, "Vol.Down", 5, 185 },
                    { 13, "", "#9d9e9e", 1, "#b4b4b4", "images/icons/circle_plus.png", (byte)0, (byte)0, "Vol.Up", 5, 95 },
                    { 14, "", "#9d9e9e", 1, "#b4b4b4", "images/icons/arrow2_down.png", (byte)0, (byte)0, "Ch.Down", 185, 185 },
                    { 15, "", "#9d9e9e", 1, "#b4b4b4", "images/icons/arrow2_up.png", (byte)0, (byte)0, "Ch.Up", 185, 95 },
                    { 16, "", "#84bde8", 1, "#8fcfff", "images/icons/settings2.png", (byte)0, (byte)0, "Input Select", 5, 5 },
                    { 17, "", "#9d9e9e", 1, "#b4b4b4", "images/icons/num_aster.png", (byte)0, (byte)0, "Ch.Aster", 5, 545 },
                    { 18, "", "#9d9e9e", 1, "#b4b4b4", "images/icons/num_sharp.png", (byte)0, (byte)0, "Ch.Sharp", 185, 545 },
                    { 19, "", "#F92068", 2, "#ff538c", "images/icons/power.png", (byte)0, (byte)1, "Power On", 5, 5 },
                    { 20, "", "#6545C6", 2, "#8463e6", "images/icons/moon.png", (byte)1, (byte)0, "Power Off", 185, 5 },
                    { 22, "", "#9d9e9e", 2, "#b4b4b4", "images/icons/circle_minus.png", (byte)0, (byte)0, "Vol.Down", 5, 185 },
                    { 45, "", "#9d9e9e", 6, "#b4b4b4", "", (byte)0, (byte)0, "Night light", 95, 95 }
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
