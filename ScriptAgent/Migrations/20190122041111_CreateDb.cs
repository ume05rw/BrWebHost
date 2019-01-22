using Microsoft.EntityFrameworkCore.Migrations;

namespace ScriptAgent.Migrations
{
    public partial class CreateDb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "controlsets",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(maxLength: 50, nullable: true),
                    BrDeviceId = table.Column<int>(nullable: true),
                    IconUrl = table.Column<string>(maxLength: 255, nullable: true),
                    Color = table.Column<string>(maxLength: 255, nullable: false),
                    Order = table.Column<int>(nullable: false),
                    ToggleState = table.Column<bool>(nullable: false),
                    IsMainPanelReady = table.Column<bool>(nullable: false),
                    IsTogglable = table.Column<bool>(nullable: false),
                    OperationType = table.Column<int>(nullable: false),
                    IsTemplate = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_controlsets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "controls",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ControlSetId = table.Column<int>(nullable: false),
                    Name = table.Column<string>(maxLength: 50, nullable: true),
                    PositionLeft = table.Column<int>(nullable: false),
                    PositionTop = table.Column<int>(nullable: false),
                    Color = table.Column<string>(maxLength: 255, nullable: false),
                    IconUrl = table.Column<string>(maxLength: 255, nullable: true),
                    Code = table.Column<string>(maxLength: 1000, nullable: true),
                    IsAssignToggleOn = table.Column<bool>(nullable: false),
                    IsAssignToggleOff = table.Column<bool>(nullable: false)
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
                columns: new[] { "Id", "BrDeviceId", "Color", "IconUrl", "IsMainPanelReady", "IsTemplate", "IsTogglable", "Name", "OperationType", "Order", "ToggleState" },
                values: new object[] { 1, null, "#fcc91f", "images/icons/operation/large/tv.png", true, true, true, "TV", 1, 99999, false });

            migrationBuilder.InsertData(
                table: "controlsets",
                columns: new[] { "Id", "BrDeviceId", "Color", "IconUrl", "IsMainPanelReady", "IsTemplate", "IsTogglable", "Name", "OperationType", "Order", "ToggleState" },
                values: new object[] { 2, null, "#F92068", "images/icons/operation/large/av.png", true, true, true, "AV", 1, 99999, false });

            migrationBuilder.InsertData(
                table: "controlsets",
                columns: new[] { "Id", "BrDeviceId", "Color", "IconUrl", "IsMainPanelReady", "IsTemplate", "IsTogglable", "Name", "OperationType", "Order", "ToggleState" },
                values: new object[] { 3, null, "#ccdc4b", "images/icons/operation/large/light.png", true, true, true, "Light", 1, 99999, false });

            migrationBuilder.InsertData(
                table: "controlsets",
                columns: new[] { "Id", "BrDeviceId", "Color", "IconUrl", "IsMainPanelReady", "IsTemplate", "IsTogglable", "Name", "OperationType", "Order", "ToggleState" },
                values: new object[] { 4, null, "#6545C6", "images/icons/operation/large/aircompressor.png", true, true, true, "Air Complessor", 1, 99999, false });

            migrationBuilder.InsertData(
                table: "controlsets",
                columns: new[] { "Id", "BrDeviceId", "Color", "IconUrl", "IsMainPanelReady", "IsTemplate", "IsTogglable", "Name", "OperationType", "Order", "ToggleState" },
                values: new object[] { 5, null, "#84bde8", "images/icons/operation/large/a1.png", true, true, false, "A1 Sensor", 2, 99999, false });

            migrationBuilder.InsertData(
                table: "controlsets",
                columns: new[] { "Id", "BrDeviceId", "Color", "IconUrl", "IsMainPanelReady", "IsTemplate", "IsTogglable", "Name", "OperationType", "Order", "ToggleState" },
                values: new object[] { 6, null, "#84bde8", "images/icons/operation/large/sp2.png", true, true, true, "Sp2 Switch", 2, 99999, false });

            migrationBuilder.InsertData(
                table: "controlsets",
                columns: new[] { "Id", "BrDeviceId", "Color", "IconUrl", "IsMainPanelReady", "IsTemplate", "IsTogglable", "Name", "OperationType", "Order", "ToggleState" },
                values: new object[] { 7, null, "#84bde8", "images/icons/operation/large/sp2.png", true, true, true, "Sp1 Switch", 2, 99999, false });

            migrationBuilder.InsertData(
                table: "controlsets",
                columns: new[] { "Id", "BrDeviceId", "Color", "IconUrl", "IsMainPanelReady", "IsTemplate", "IsTogglable", "Name", "OperationType", "Order", "ToggleState" },
                values: new object[] { 8, null, "#84bde8", "images/icons/operation/large/sp2.png", true, true, true, "Single Control", 2, 99999, false });

            migrationBuilder.InsertData(
                table: "controlsets",
                columns: new[] { "Id", "BrDeviceId", "Color", "IconUrl", "IsMainPanelReady", "IsTemplate", "IsTogglable", "Name", "OperationType", "Order", "ToggleState" },
                values: new object[] { 9, null, "#84bde8", "images/icons/operation/large/sp2.png", true, true, true, "No Control", 2, 99999, false });

            migrationBuilder.InsertData(
                table: "controlsets",
                columns: new[] { "Id", "BrDeviceId", "Color", "IconUrl", "IsMainPanelReady", "IsTemplate", "IsTogglable", "Name", "OperationType", "Order", "ToggleState" },
                values: new object[] { 10, null, "#81c03b", "images/icons/operation/large/script.png", true, false, true, "On your PC", 4, 99999, false });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 1, "", "#F92068", 1, "images/icons/power.png", true, true, "Power", 5, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 28, "", "#9d9e9e", 2, "images/icons/circle_pause.png", false, false, "Pause", 95, 365 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 29, "", "#F92068", 3, "images/icons/power.png", false, true, "Power On", 5, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 30, "", "#6545C6", 3, "images/icons/moon.png", true, false, "Power Off", 185, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 31, "", "#9d9e9e", 3, "images/icons/arrow2_up.png", false, false, "Up", 95, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 32, "", "#9d9e9e", 3, "images/icons/arrow2_down.png", false, false, "Down", 95, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 33, "", "#F92068", 4, "images/icons/power.png", false, true, "Power On", 5, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 34, "", "#6545C6", 4, "images/icons/moon.png", true, false, "Power Off", 185, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 35, "", "#9d9e9e", 4, "", false, false, "Temp.", 95, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 36, "", "#9d9e9e", 4, "images/icons/settings2.png", false, false, "Select", 5, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 37, "", "#9d9e9e", 4, "images/icons/arrow2_up.png", false, false, "Up", 185, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 27, "", "#9d9e9e", 2, "images/icons/darrow_left.png", false, false, "Prev", 5, 365 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 38, "", "#9d9e9e", 4, "images/icons/arrow2_down.png", false, false, "Down", 185, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 40, "Humidity", "#84bde8", 5, "", false, false, "Humidity", 5, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 41, "Voc", "#81c03b", 5, "", false, false, "VOC", 95, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 42, "Light", "#fcc91f", 5, "", false, false, "Light", 5, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 43, "Noise", "#B5743B", 5, "", false, false, "Noise", 185, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 44, "PowerOn", "#F92068", 6, "", false, true, "Power On", 5, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 45, "PowerOff", "#9d9e9e", 6, "", true, false, "Power Off", 185, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 46, "LightOn", "#6545C6", 6, "", false, false, "Light On", 5, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 47, "LightOff", "#9d9e9e", 6, "", false, false, "Light Off", 185, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 48, "PowerOn", "#F92068", 7, "", false, true, "Power On", 5, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 49, "PowerOff", "#9d9e9e", 7, "", true, false, "Power Off", 185, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 39, "Temp", "#F92068", 5, "", false, false, "Temp.", 185, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 50, "Control", "#9d9e9e", 8, "", false, false, "Control", 95, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 26, "", "#9d9e9e", 2, "images/icons/darrow_right.png", false, false, "Next", 185, 365 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 24, "", "#9d9e9e", 2, "images/icons/arrow2_down.png", false, false, "Ch.Down", 185, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 2, "", "#9d9e9e", 1, "images/icons/num_0.png", false, false, "Ch.0", 95, 545 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 3, "", "#9d9e9e", 1, "images/icons/num_9.png", false, false, "Ch.9", 185, 455 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 4, "", "#9d9e9e", 1, "images/icons/num_8.png", false, false, "Ch.8", 95, 455 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 5, "", "#9d9e9e", 1, "images/icons/num_7.png", false, false, "Ch.7", 5, 455 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 6, "", "#9d9e9e", 1, "images/icons/num_6.png", false, false, "Ch.6", 185, 365 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 7, "", "#9d9e9e", 1, "images/icons/num_5.png", false, false, "Ch.5", 95, 365 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 8, "", "#9d9e9e", 1, "images/icons/num_4.png", false, false, "Ch.4", 5, 365 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 9, "", "#9d9e9e", 1, "images/icons/num_3.png", false, false, "Ch.3", 185, 275 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 10, "", "#9d9e9e", 1, "images/icons/num_2.png", false, false, "Ch.2", 95, 275 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 11, "", "#9d9e9e", 1, "images/icons/num_1.png", false, false, "Ch.1", 5, 275 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 25, "", "#9d9e9e", 2, "images/icons/circle_play.png", false, false, "Play", 95, 275 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 12, "", "#9d9e9e", 1, "images/icons/circle_minus.png", false, false, "Vol.Down", 5, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 14, "", "#9d9e9e", 1, "images/icons/arrow2_down.png", false, false, "Ch.Down", 185, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 15, "", "#9d9e9e", 1, "images/icons/arrow2_up.png", false, false, "Ch.Up", 185, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 16, "", "#84bde8", 1, "images/icons/settings2.png", false, false, "Input Select", 185, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 17, "", "#9d9e9e", 1, "images/icons/num_aster.png", false, false, "Ch.Aster", 5, 545 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 18, "", "#9d9e9e", 1, "images/icons/num_sharp.png", false, false, "Ch.Sharp", 185, 545 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 19, "", "#F92068", 2, "images/icons/power.png", false, true, "Power On", 5, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 20, "", "#6545C6", 2, "images/icons/moon.png", true, false, "Power Off", 185, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 21, "", "#9d9e9e", 2, "images/icons/circle_plus.png", false, false, "Vol.Up", 5, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 22, "", "#9d9e9e", 2, "images/icons/circle_minus.png", false, false, "Vol.Down", 5, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 23, "", "#9d9e9e", 2, "images/icons/arrow2_up.png", false, false, "Ch.Up", 185, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 13, "", "#9d9e9e", 1, "images/icons/circle_plus.png", false, false, "Vol.Up", 5, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 51, "notepad.exe", "#F92068", 10, "", false, false, "NotePad", 95, 5 });

            migrationBuilder.CreateIndex(
                name: "IX_controls_ControlSetId",
                table: "controls",
                column: "ControlSetId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "controls");

            migrationBuilder.DropTable(
                name: "controlsets");
        }
    }
}
