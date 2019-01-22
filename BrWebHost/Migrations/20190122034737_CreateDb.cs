using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BrWebHost.Migrations
{
    public partial class CreateDb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "a1sensors",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    BrDeviceId = table.Column<int>(nullable: true),
                    Temperature = table.Column<decimal>(nullable: false),
                    Humidity = table.Column<decimal>(nullable: false),
                    Voc = table.Column<decimal>(nullable: false),
                    Light = table.Column<decimal>(nullable: false),
                    Noise = table.Column<decimal>(nullable: false),
                    AcquiredCount = table.Column<int>(nullable: false),
                    Recorded = table.Column<DateTime>(nullable: false),
                    Created = table.Column<DateTime>(nullable: false),
                    Updated = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_a1sensors", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "brdevices",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MacAddressString = table.Column<string>(nullable: false),
                    IpAddressString = table.Column<string>(nullable: false),
                    Port = table.Column<int>(nullable: false),
                    DeviceTypeDetailNumber = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_brdevices", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "jobs",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(nullable: false),
                    IsCompleted = table.Column<bool>(nullable: false),
                    IsError = table.Column<bool>(nullable: false),
                    Progress = table.Column<decimal>(nullable: false),
                    Message = table.Column<string>(maxLength: 1000, nullable: true),
                    Json = table.Column<string>(maxLength: 1000, nullable: true),
                    Created = table.Column<DateTime>(nullable: false),
                    Updated = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_jobs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "remotehosts",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(maxLength: 50, nullable: true),
                    IpAddressString = table.Column<string>(maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_remotehosts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "scenes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(nullable: true),
                    IconUrl = table.Column<string>(nullable: true),
                    Color = table.Column<string>(nullable: false),
                    Order = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_scenes", x => x.Id);
                });

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
                    OpenedFiledCount = table.Column<int>(nullable: false),
                    Recorded = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_serverstatuses", x => x.Id);
                });

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
                    table.ForeignKey(
                        name: "FK_controlsets_brdevices_BrDeviceId",
                        column: x => x.BrDeviceId,
                        principalTable: "brdevices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "remotescripts",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    RemoteHostId = table.Column<int>(nullable: false),
                    ControlId = table.Column<int>(nullable: false),
                    Name = table.Column<string>(maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_remotescripts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_remotescripts_remotehosts_RemoteHostId",
                        column: x => x.RemoteHostId,
                        principalTable: "remotehosts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
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

            migrationBuilder.CreateTable(
                name: "scenedetails",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    SceneId = table.Column<int>(nullable: false),
                    ControlSetId = table.Column<int>(nullable: false),
                    ControlId = table.Column<int>(nullable: false),
                    WaitSecond = table.Column<decimal>(nullable: false),
                    Order = table.Column<int>(nullable: false)
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
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_scenedetails_scenes_SceneId",
                        column: x => x.SceneId,
                        principalTable: "scenes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "schedules",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(nullable: true),
                    IconUrl = table.Column<string>(nullable: true),
                    SceneId = table.Column<int>(nullable: true),
                    ControlSetId = table.Column<int>(nullable: true),
                    ControlId = table.Column<int>(nullable: true),
                    CurrentJobId = table.Column<int>(nullable: true),
                    Enabled = table.Column<bool>(nullable: false),
                    StartTime = table.Column<DateTime>(nullable: false),
                    WeekdayFlags = table.Column<string>(maxLength: 7, nullable: true),
                    NextDateTime = table.Column<DateTime>(nullable: true),
                    Color = table.Column<string>(nullable: false),
                    Order = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_schedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_schedules_controls_ControlId",
                        column: x => x.ControlId,
                        principalTable: "controls",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_schedules_controlsets_ControlSetId",
                        column: x => x.ControlSetId,
                        principalTable: "controlsets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_schedules_jobs_CurrentJobId",
                        column: x => x.CurrentJobId,
                        principalTable: "jobs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_schedules_scenes_SceneId",
                        column: x => x.SceneId,
                        principalTable: "scenes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
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
                values: new object[] { 10, null, "#fcc91f", "images/icons/operation/large/tv.png", true, false, true, "TV", 1, 99999, false });

            migrationBuilder.InsertData(
                table: "controlsets",
                columns: new[] { "Id", "BrDeviceId", "Color", "IconUrl", "IsMainPanelReady", "IsTemplate", "IsTogglable", "Name", "OperationType", "Order", "ToggleState" },
                values: new object[] { 11, null, "#F92068", "images/icons/operation/large/av.png", true, false, true, "AV", 1, 99999, false });

            migrationBuilder.InsertData(
                table: "controlsets",
                columns: new[] { "Id", "BrDeviceId", "Color", "IconUrl", "IsMainPanelReady", "IsTemplate", "IsTogglable", "Name", "OperationType", "Order", "ToggleState" },
                values: new object[] { 12, null, "#ccdc4b", "images/icons/operation/large/light.png", true, false, true, "Light", 1, 99999, false });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 1, "", "#F92068", 1, "images/icons/power.png", true, true, "Power", 5, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 59, "", "#9d9e9e", 10, "images/icons/num_3.png", false, false, "Ch.3", 185, 275 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 58, "", "#9d9e9e", 10, "images/icons/num_4.png", false, false, "Ch.4", 5, 365 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 57, "", "#9d9e9e", 10, "images/icons/num_5.png", false, false, "Ch.5", 95, 365 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 56, "", "#9d9e9e", 10, "images/icons/num_6.png", false, false, "Ch.6", 185, 365 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 55, "", "#9d9e9e", 10, "images/icons/num_7.png", false, false, "Ch.7", 5, 455 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 54, "", "#9d9e9e", 10, "images/icons/num_8.png", false, false, "Ch.8", 95, 455 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 53, "", "#9d9e9e", 10, "images/icons/num_9.png", false, false, "Ch.9", 185, 455 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 60, "", "#9d9e9e", 10, "images/icons/num_2.png", false, false, "Ch.2", 95, 275 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 52, "", "#9d9e9e", 10, "images/icons/num_0.png", false, false, "Ch.0", 95, 545 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 50, "Control", "#9d9e9e", 8, "", false, false, "Control", 95, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 49, "PowerOff", "#9d9e9e", 7, "", true, false, "Power Off", 185, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 48, "PowerOn", "#F92068", 7, "", false, true, "Power On", 5, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 47, "LightOff", "#9d9e9e", 6, "", false, false, "Light Off", 185, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 46, "LightOn", "#6545C6", 6, "", false, false, "Light On", 5, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 45, "PowerOff", "#9d9e9e", 6, "", true, false, "Power Off", 185, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 44, "PowerOn", "#F92068", 6, "", false, true, "Power On", 5, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 51, "", "#F92068", 10, "images/icons/power.png", true, true, "Power", 5, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 61, "", "#9d9e9e", 10, "images/icons/num_1.png", false, false, "Ch.1", 5, 275 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 62, "", "#9d9e9e", 10, "images/icons/circle_minus.png", false, false, "Vol.Down", 5, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 63, "", "#9d9e9e", 10, "images/icons/circle_plus.png", false, false, "Vol.Up", 5, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 80, "", "#6545C6", 12, "images/icons/cancel.png", true, false, "Power Off", 185, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 79, "", "#F92068", 12, "images/icons/power.png", false, true, "Power On", 5, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 78, "", "#9d9e9e", 11, "images/icons/circle_pause.png", false, false, "Pause", 95, 365 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 77, "", "#9d9e9e", 11, "images/icons/darrow_left.png", false, false, "Prev", 5, 365 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 76, "", "#9d9e9e", 11, "images/icons/darrow_right.png", false, false, "Next", 185, 365 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 75, "", "#9d9e9e", 11, "images/icons/circle_play.png", false, false, "Play", 95, 275 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 74, "", "#9d9e9e", 11, "images/icons/arrow2_down.png", false, false, "Ch.Down", 185, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 73, "", "#9d9e9e", 11, "images/icons/arrow2_up.png", false, false, "Ch.Up", 185, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 72, "", "#9d9e9e", 11, "images/icons/circle_minus.png", false, false, "Vol.Down", 5, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 71, "", "#9d9e9e", 11, "images/icons/circle_plus.png", false, false, "Vol.Up", 5, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 70, "", "#6545C6", 11, "images/icons/cancel.png", true, false, "Power Off", 185, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 69, "", "#F92068", 11, "images/icons/power.png", false, true, "Power On", 5, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 68, "", "#9d9e9e", 10, "images/icons/num_sharp.png", false, false, "Ch.Sharp", 185, 545 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 67, "", "#9d9e9e", 10, "images/icons/num_aster.png", false, false, "Ch.Aster", 5, 545 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 66, "", "#84bde8", 10, "images/icons/settings2.png", false, false, "Input Select", 185, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 65, "", "#9d9e9e", 10, "images/icons/arrow2_up.png", false, false, "Ch.Up", 185, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 64, "", "#9d9e9e", 10, "images/icons/arrow2_down.png", false, false, "Ch.Down", 185, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 43, "Noise", "#B5743B", 5, "", false, false, "Noise", 185, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 42, "Light", "#fcc91f", 5, "", false, false, "Light", 5, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 41, "Voc", "#81c03b", 5, "", false, false, "VOC", 95, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 40, "Humidity", "#84bde8", 5, "", false, false, "Humidity", 5, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 18, "", "#9d9e9e", 1, "images/icons/num_sharp.png", false, false, "Ch.Sharp", 185, 545 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 17, "", "#9d9e9e", 1, "images/icons/num_aster.png", false, false, "Ch.Aster", 5, 545 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 16, "", "#84bde8", 1, "images/icons/settings2.png", false, false, "Input Select", 185, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 15, "", "#9d9e9e", 1, "images/icons/arrow2_up.png", false, false, "Ch.Up", 185, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 14, "", "#9d9e9e", 1, "images/icons/arrow2_down.png", false, false, "Ch.Down", 185, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 13, "", "#9d9e9e", 1, "images/icons/circle_plus.png", false, false, "Vol.Up", 5, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 12, "", "#9d9e9e", 1, "images/icons/circle_minus.png", false, false, "Vol.Down", 5, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 11, "", "#9d9e9e", 1, "images/icons/num_1.png", false, false, "Ch.1", 5, 275 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 10, "", "#9d9e9e", 1, "images/icons/num_2.png", false, false, "Ch.2", 95, 275 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 9, "", "#9d9e9e", 1, "images/icons/num_3.png", false, false, "Ch.3", 185, 275 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 8, "", "#9d9e9e", 1, "images/icons/num_4.png", false, false, "Ch.4", 5, 365 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 7, "", "#9d9e9e", 1, "images/icons/num_5.png", false, false, "Ch.5", 95, 365 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 6, "", "#9d9e9e", 1, "images/icons/num_6.png", false, false, "Ch.6", 185, 365 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 5, "", "#9d9e9e", 1, "images/icons/num_7.png", false, false, "Ch.7", 5, 455 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 4, "", "#9d9e9e", 1, "images/icons/num_8.png", false, false, "Ch.8", 95, 455 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 3, "", "#9d9e9e", 1, "images/icons/num_9.png", false, false, "Ch.9", 185, 455 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 2, "", "#9d9e9e", 1, "images/icons/num_0.png", false, false, "Ch.0", 95, 545 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 19, "", "#F92068", 2, "images/icons/power.png", false, true, "Power On", 5, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 81, "", "#9d9e9e", 12, "images/icons/arrow2_up.png", false, false, "Up", 95, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 20, "", "#6545C6", 2, "images/icons/cancel.png", true, false, "Power Off", 185, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 22, "", "#9d9e9e", 2, "images/icons/circle_minus.png", false, false, "Vol.Down", 5, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 39, "Temp", "#F92068", 5, "", false, false, "Temp.", 185, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 38, "", "#9d9e9e", 4, "images/icons/arrow2_down.png", false, false, "Down", 185, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 37, "", "#9d9e9e", 4, "images/icons/arrow2_up.png", false, false, "Up", 185, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 36, "", "#9d9e9e", 4, "images/icons/settings2.png", false, false, "Select", 5, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 35, "", "#9d9e9e", 4, "", false, false, "Temp.", 95, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 34, "", "#6545C6", 4, "images/icons/cancel.png", true, false, "Power Off", 185, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 33, "", "#F92068", 4, "images/icons/power.png", false, true, "Power On", 5, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 32, "", "#9d9e9e", 3, "images/icons/arrow2_down.png", false, false, "Down", 95, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 31, "", "#9d9e9e", 3, "images/icons/arrow2_up.png", false, false, "Up", 95, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 30, "", "#6545C6", 3, "images/icons/cancel.png", true, false, "Power Off", 185, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 29, "", "#F92068", 3, "images/icons/power.png", false, true, "Power On", 5, 5 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 28, "", "#9d9e9e", 2, "images/icons/circle_pause.png", false, false, "Pause", 95, 365 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 27, "", "#9d9e9e", 2, "images/icons/darrow_left.png", false, false, "Prev", 5, 365 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 26, "", "#9d9e9e", 2, "images/icons/darrow_right.png", false, false, "Next", 185, 365 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 25, "", "#9d9e9e", 2, "images/icons/circle_play.png", false, false, "Play", 95, 275 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 24, "", "#9d9e9e", 2, "images/icons/arrow2_down.png", false, false, "Ch.Down", 185, 185 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 23, "", "#9d9e9e", 2, "images/icons/arrow2_up.png", false, false, "Ch.Up", 185, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 21, "", "#9d9e9e", 2, "images/icons/circle_plus.png", false, false, "Vol.Up", 5, 95 });

            migrationBuilder.InsertData(
                table: "controls",
                columns: new[] { "Id", "Code", "Color", "ControlSetId", "IconUrl", "IsAssignToggleOff", "IsAssignToggleOn", "Name", "PositionLeft", "PositionTop" },
                values: new object[] { 82, "", "#9d9e9e", 12, "images/icons/arrow2_down.png", false, false, "Down", 95, 185 });

            migrationBuilder.CreateIndex(
                name: "IX_controls_ControlSetId",
                table: "controls",
                column: "ControlSetId");

            migrationBuilder.CreateIndex(
                name: "IX_controlsets_BrDeviceId",
                table: "controlsets",
                column: "BrDeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_remotescripts_RemoteHostId",
                table: "remotescripts",
                column: "RemoteHostId");

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

            migrationBuilder.CreateIndex(
                name: "IX_schedules_ControlId",
                table: "schedules",
                column: "ControlId");

            migrationBuilder.CreateIndex(
                name: "IX_schedules_ControlSetId",
                table: "schedules",
                column: "ControlSetId");

            migrationBuilder.CreateIndex(
                name: "IX_schedules_CurrentJobId",
                table: "schedules",
                column: "CurrentJobId");

            migrationBuilder.CreateIndex(
                name: "IX_schedules_SceneId",
                table: "schedules",
                column: "SceneId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "a1sensors");

            migrationBuilder.DropTable(
                name: "remotescripts");

            migrationBuilder.DropTable(
                name: "scenedetails");

            migrationBuilder.DropTable(
                name: "schedules");

            migrationBuilder.DropTable(
                name: "serverstatuses");

            migrationBuilder.DropTable(
                name: "remotehosts");

            migrationBuilder.DropTable(
                name: "controls");

            migrationBuilder.DropTable(
                name: "jobs");

            migrationBuilder.DropTable(
                name: "scenes");

            migrationBuilder.DropTable(
                name: "controlsets");

            migrationBuilder.DropTable(
                name: "brdevices");
        }
    }
}
