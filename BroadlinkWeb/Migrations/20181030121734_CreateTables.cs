using Microsoft.EntityFrameworkCore.Migrations;

namespace BroadlinkWeb.Migrations
{
    public partial class CreateTables : Migration
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
                name: "remotehost",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySQL:AutoIncrement", true),
                    Name = table.Column<string>(type: "varchar(50)", nullable: true),
                    IpAddressString = table.Column<string>(type: "varchar(255)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_remotehost", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "scenes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySQL:AutoIncrement", true),
                    Name = table.Column<string>(type: "varchar(50)", nullable: true),
                    IconUrl = table.Column<string>(type: "varchar(255)", nullable: true),
                    Color = table.Column<string>(type: "varchar(255)", nullable: false),
                    Order = table.Column<int>(type: "int(11)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_scenes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "controlsets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySQL:AutoIncrement", true),
                    Name = table.Column<string>(type: "varchar(50)", nullable: true),
                    BrDeviceId = table.Column<int>(type: "int(11)", nullable: true),
                    IconUrl = table.Column<string>(type: "varchar(255)", nullable: true),
                    Color = table.Column<string>(type: "varchar(255)", nullable: false),
                    Order = table.Column<int>(type: "int(11)", nullable: false),
                    ToggleState = table.Column<byte>(type: "tinyint(1)", nullable: false),
                    IsMainPanelReady = table.Column<byte>(type: "tinyint(1)", nullable: false),
                    IsTogglable = table.Column<byte>(type: "tinyint(1)", nullable: false),
                    OperationType = table.Column<byte>(type: "tinyint(2)", nullable: false),
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

            migrationBuilder.CreateTable(
                name: "scenedetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySQL:AutoIncrement", true),
                    SceneId = table.Column<int>(type: "int(11)", nullable: false),
                    ControlSetId = table.Column<int>(type: "int(11)", nullable: false),
                    ControlId = table.Column<int>(type: "int(11)", nullable: false),
                    WaitSecond = table.Column<decimal>(type: "decimal(6, 1)", nullable: false),
                    Order = table.Column<int>(type: "int(11)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_scenedetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_scenedetails_controls_ControlId",
                        column: x => x.ControlId,
                        principalTable: "controls",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_scenedetails_controlsets_ControlSetId",
                        column: x => x.ControlSetId,
                        principalTable: "controlsets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_scenedetails_scenes_SceneId",
                        column: x => x.SceneId,
                        principalTable: "scenes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "controlsets",
                columns: new[] { "Id", "BrDeviceId", "Color", "IconUrl", "IsMainPanelReady", "IsTemplate", "IsTogglable", "Name", "OperationType", "Order", "ToggleState" },
                values: new object[,]
                {
                    { 1, null, "#fcc91f", "images/icons/controlset/tv.png", (byte)1, (byte)1, (byte)1, "TV", (byte)1, 99999, (byte)0 },
                    { 2, null, "#F92068", "images/icons/controlset/av.png", (byte)1, (byte)1, (byte)1, "AV", (byte)1, 99999, (byte)0 },
                    { 3, null, "#ccdc4b", "images/icons/controlset/light.png", (byte)1, (byte)1, (byte)1, "Light", (byte)1, 99999, (byte)0 },
                    { 4, null, "#6545C6", "images/icons/controlset/aircompressor.png", (byte)1, (byte)1, (byte)1, "Air Complessor", (byte)1, 99999, (byte)0 },
                    { 5, null, "#84bde8", "images/icons/controlset/a1.png", (byte)1, (byte)1, (byte)0, "A1 Sensor", (byte)2, 99999, (byte)0 },
                    { 6, null, "#84bde8", "images/icons/controlset/sp2.png", (byte)1, (byte)1, (byte)1, "Sp2 Switch", (byte)2, 99999, (byte)0 },
                    { 7, null, "#84bde8", "images/icons/controlset/sp2.png", (byte)1, (byte)1, (byte)1, "Sp1 Switch", (byte)2, 99999, (byte)0 },
                    { 8, null, "#84bde8", "images/icons/controlset/sp2.png", (byte)1, (byte)1, (byte)1, "Single Control", (byte)2, 99999, (byte)0 },
                    { 9, null, "#84bde8", "images/icons/controlset/sp2.png", (byte)1, (byte)1, (byte)1, "No Control", (byte)2, 99999, (byte)0 }
                });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[,]
                {
                    { 1, "", "#F92068", 1, "images/icons/power.png", (byte)1, (byte)1, "Power", 5, 5 },
                    { 28, "", "#9d9e9e", 2, "images/icons/circle_pause.png", (byte)0, (byte)0, "Pause", 95, 365 },
                    { 29, "", "#F92068", 3, "images/icons/power.png", (byte)0, (byte)1, "Power On", 5, 5 },
                    { 30, "", "#6545C6", 3, "images/icons/moon.png", (byte)1, (byte)0, "Power Off", 185, 5 },
                    { 31, "", "#9d9e9e", 3, "images/icons/arrow2_up.png", (byte)0, (byte)0, "Up", 95, 95 },
                    { 32, "", "#9d9e9e", 3, "images/icons/arrow2_down.png", (byte)0, (byte)0, "Down", 95, 185 },
                    { 33, "", "#F92068", 4, "images/icons/power.png", (byte)0, (byte)1, "Power On", 5, 5 },
                    { 34, "", "#6545C6", 4, "images/icons/moon.png", (byte)1, (byte)0, "Power Off", 185, 5 },
                    { 35, "", "#9d9e9e", 4, "", (byte)0, (byte)0, "Temp.", 95, 95 },
                    { 36, "", "#9d9e9e", 4, "images/icons/settings2.png", (byte)0, (byte)0, "Select", 5, 185 },
                    { 37, "", "#9d9e9e", 4, "images/icons/arrow2_up.png", (byte)0, (byte)0, "Up", 185, 95 },
                    { 38, "", "#9d9e9e", 4, "images/icons/arrow2_down.png", (byte)0, (byte)0, "Down", 185, 185 },
                    { 39, "Temp", "#F92068", 5, "", (byte)0, (byte)0, "Temp.", 185, 5 },
                    { 40, "Humidity", "#84bde8", 5, "", (byte)0, (byte)0, "Humidity", 5, 5 },
                    { 41, "Voc", "#81c03b", 5, "", (byte)0, (byte)0, "VOC", 95, 95 },
                    { 42, "Light", "#fcc91f", 5, "", (byte)0, (byte)0, "Light", 5, 185 },
                    { 43, "Noise", "#B5743B", 5, "", (byte)0, (byte)0, "Noise", 185, 185 },
                    { 44, "PowerOn", "#F92068", 6, "", (byte)0, (byte)1, "Power On", 5, 5 },
                    { 45, "PowerOff", "#9d9e9e", 6, "", (byte)1, (byte)0, "Power Off", 185, 5 },
                    { 46, "LightOn", "#6545C6", 6, "", (byte)0, (byte)0, "Light On", 5, 95 },
                    { 47, "LightOff", "#9d9e9e", 6, "", (byte)0, (byte)0, "Light Off", 185, 95 },
                    { 48, "PowerOn", "#F92068", 7, "", (byte)0, (byte)1, "Power On", 5, 5 },
                    { 27, "", "#9d9e9e", 2, "images/icons/darrow_left.png", (byte)0, (byte)0, "Prev", 5, 365 },
                    { 26, "", "#9d9e9e", 2, "images/icons/darrow_right.png", (byte)0, (byte)0, "Next", 185, 365 },
                    { 25, "", "#9d9e9e", 2, "images/icons/circle_play.png", (byte)0, (byte)0, "Play", 95, 275 },
                    { 24, "", "#9d9e9e", 2, "images/icons/arrow2_down.png", (byte)0, (byte)0, "Ch.Down", 185, 185 },
                    { 2, "", "#9d9e9e", 1, "images/icons/num_0.png", (byte)0, (byte)0, "Ch.0", 95, 545 },
                    { 3, "", "#9d9e9e", 1, "images/icons/num_9.png", (byte)0, (byte)0, "Ch.9", 185, 455 },
                    { 4, "", "#9d9e9e", 1, "images/icons/num_8.png", (byte)0, (byte)0, "Ch.8", 95, 455 },
                    { 5, "", "#9d9e9e", 1, "images/icons/num_7.png", (byte)0, (byte)0, "Ch.7", 5, 455 },
                    { 6, "", "#9d9e9e", 1, "images/icons/num_6.png", (byte)0, (byte)0, "Ch.6", 185, 365 },
                    { 7, "", "#9d9e9e", 1, "images/icons/num_5.png", (byte)0, (byte)0, "Ch.5", 95, 365 },
                    { 8, "", "#9d9e9e", 1, "images/icons/num_4.png", (byte)0, (byte)0, "Ch.4", 5, 365 },
                    { 9, "", "#9d9e9e", 1, "images/icons/num_3.png", (byte)0, (byte)0, "Ch.3", 185, 275 },
                    { 10, "", "#9d9e9e", 1, "images/icons/num_2.png", (byte)0, (byte)0, "Ch.2", 95, 275 },
                    { 11, "", "#9d9e9e", 1, "images/icons/num_1.png", (byte)0, (byte)0, "Ch.1", 5, 275 },
                    { 49, "PowerOff", "#9d9e9e", 7, "", (byte)1, (byte)0, "Power Off", 185, 5 },
                    { 12, "", "#9d9e9e", 1, "images/icons/circle_minus.png", (byte)0, (byte)0, "Vol.Down", 5, 185 },
                    { 14, "", "#9d9e9e", 1, "images/icons/arrow2_down.png", (byte)0, (byte)0, "Ch.Down", 185, 185 },
                    { 15, "", "#9d9e9e", 1, "images/icons/arrow2_up.png", (byte)0, (byte)0, "Ch.Up", 185, 95 },
                    { 16, "", "#84bde8", 1, "images/icons/settings2.png", (byte)0, (byte)0, "Input Select", 185, 5 },
                    { 17, "", "#9d9e9e", 1, "images/icons/num_aster.png", (byte)0, (byte)0, "Ch.Aster", 5, 545 },
                    { 18, "", "#9d9e9e", 1, "images/icons/num_sharp.png", (byte)0, (byte)0, "Ch.Sharp", 185, 545 },
                    { 19, "", "#F92068", 2, "images/icons/power.png", (byte)0, (byte)1, "Power On", 5, 5 },
                    { 20, "", "#6545C6", 2, "images/icons/moon.png", (byte)1, (byte)0, "Power Off", 185, 5 },
                    { 21, "", "#9d9e9e", 2, "images/icons/circle_plus.png", (byte)0, (byte)0, "Vol.Up", 5, 95 },
                    { 22, "", "#9d9e9e", 2, "images/icons/circle_minus.png", (byte)0, (byte)0, "Vol.Down", 5, 185 },
                    { 23, "", "#9d9e9e", 2, "images/icons/arrow2_up.png", (byte)0, (byte)0, "Ch.Up", 185, 95 },
                    { 13, "", "#9d9e9e", 1, "images/icons/circle_plus.png", (byte)0, (byte)0, "Vol.Up", 5, 95 },
                    { 50, "Control", "#9d9e9e", 8, "", (byte)0, (byte)0, "Control", 95, 5 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_controls_ControlSetId",
                table: "controls",
                column: "ControlSetId");

            migrationBuilder.CreateIndex(
                name: "IX_controlsets_BrDeviceId",
                table: "controlsets",
                column: "BrDeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_scenedetails_ControlId",
                table: "scenedetails",
                column: "ControlId");

            migrationBuilder.CreateIndex(
                name: "IX_scenedetails_ControlSetId",
                table: "scenedetails",
                column: "ControlSetId");

            migrationBuilder.CreateIndex(
                name: "IX_scenedetails_SceneId",
                table: "scenedetails",
                column: "SceneId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "remotehost");

            migrationBuilder.DropTable(
                name: "scenedetails");

            migrationBuilder.DropTable(
                name: "controls");

            migrationBuilder.DropTable(
                name: "scenes");

            migrationBuilder.DropTable(
                name: "controlsets");

            migrationBuilder.DropTable(
                name: "brdevices");
        }
    }
}
