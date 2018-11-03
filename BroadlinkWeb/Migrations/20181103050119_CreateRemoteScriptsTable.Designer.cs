﻿// <auto-generated />
using System;
using BroadlinkWeb.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace BroadlinkWeb.Migrations
{
    [DbContext(typeof(Dbc))]
    [Migration("20181103050119_CreateRemoteScriptsTable")]
    partial class CreateRemoteScriptsTable
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.4-rtm-31024");

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.A1Values", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int(11)");

                    b.Property<int>("AcquiredCount")
                        .HasColumnType("int(5)");

                    b.Property<int?>("BrDeviceId")
                        .HasColumnType("int(11)");

                    b.Property<DateTime>("Created")
                        .HasColumnType("datetime");

                    b.Property<decimal>("Humidity")
                        .HasColumnType("decimal(5, 2)");

                    b.Property<decimal>("Light")
                        .HasColumnType("decimal(5, 2)");

                    b.Property<decimal>("Noise")
                        .HasColumnType("decimal(5, 2)");

                    b.Property<DateTime>("Recorded")
                        .HasColumnType("datetime");

                    b.Property<decimal>("Temperature")
                        .HasColumnType("decimal(5, 2)");

                    b.Property<DateTime?>("Updated")
                        .HasColumnType("datetime");

                    b.Property<decimal>("Voc")
                        .HasColumnType("decimal(5, 2)");

                    b.HasKey("Id");

                    b.ToTable("a1sensors");

                    b.HasAnnotation("MySQL:Charset", "utf8");

                    b.HasAnnotation("MySQL:Collation", "utf8_general_ci ");
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.BrDevice", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int(11)");

                    b.Property<int>("DeviceTypeDetailNumber")
                        .HasColumnType("int(6)");

                    b.Property<string>("IpAddressString")
                        .IsRequired()
                        .HasColumnType("varchar(20)");

                    b.Property<string>("MacAddressString")
                        .IsRequired()
                        .HasColumnType("varchar(20)");

                    b.Property<int>("Port")
                        .HasColumnType("int(5)");

                    b.HasKey("Id");

                    b.ToTable("brdevices");

                    b.HasAnnotation("MySQL:Charset", "utf8");

                    b.HasAnnotation("MySQL:Collation", "utf8_general_ci ");
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.Control", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int(11)");

                    b.Property<string>("Code")
                        .HasColumnType("text")
                        .HasMaxLength(1000);

                    b.Property<string>("Color")
                        .IsRequired()
                        .HasColumnType("varchar(255)")
                        .HasMaxLength(255);

                    b.Property<int>("ControlSetId")
                        .HasColumnType("int(11)");

                    b.Property<string>("IconUrl")
                        .HasColumnType("varchar(255)")
                        .HasMaxLength(255);

                    b.Property<byte>("IsAssignToggleOff")
                        .HasColumnType("tinyint(1)");

                    b.Property<byte>("IsAssignToggleOn")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Name")
                        .HasColumnType("varchar(50)")
                        .HasMaxLength(50);

                    b.Property<int>("PositionLeft")
                        .HasColumnType("int(11)");

                    b.Property<int>("PositionTop")
                        .HasColumnType("int(11)");

                    b.HasKey("Id");

                    b.HasIndex("ControlSetId");

                    b.ToTable("controls");

                    b.HasAnnotation("MySQL:Charset", "utf8");

                    b.HasAnnotation("MySQL:Collation", "utf8_general_ci ");

                    b.HasData(
                        new { Id = 1, Code = "", Color = "#F92068", ControlSetId = 1, IconUrl = "images/icons/power.png", IsAssignToggleOff = (byte)1, IsAssignToggleOn = (byte)1, Name = "Power", PositionLeft = 5, PositionTop = 5 },
                        new { Id = 2, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_0.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Ch.0", PositionLeft = 95, PositionTop = 545 },
                        new { Id = 3, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_9.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Ch.9", PositionLeft = 185, PositionTop = 455 },
                        new { Id = 4, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_8.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Ch.8", PositionLeft = 95, PositionTop = 455 },
                        new { Id = 5, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_7.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Ch.7", PositionLeft = 5, PositionTop = 455 },
                        new { Id = 6, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_6.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Ch.6", PositionLeft = 185, PositionTop = 365 },
                        new { Id = 7, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_5.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Ch.5", PositionLeft = 95, PositionTop = 365 },
                        new { Id = 8, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_4.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Ch.4", PositionLeft = 5, PositionTop = 365 },
                        new { Id = 9, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_3.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Ch.3", PositionLeft = 185, PositionTop = 275 },
                        new { Id = 10, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_2.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Ch.2", PositionLeft = 95, PositionTop = 275 },
                        new { Id = 11, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_1.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Ch.1", PositionLeft = 5, PositionTop = 275 },
                        new { Id = 12, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/circle_minus.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Vol.Down", PositionLeft = 5, PositionTop = 185 },
                        new { Id = 13, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/circle_plus.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Vol.Up", PositionLeft = 5, PositionTop = 95 },
                        new { Id = 14, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/arrow2_down.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Ch.Down", PositionLeft = 185, PositionTop = 185 },
                        new { Id = 15, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/arrow2_up.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Ch.Up", PositionLeft = 185, PositionTop = 95 },
                        new { Id = 16, Code = "", Color = "#84bde8", ControlSetId = 1, IconUrl = "images/icons/settings2.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Input Select", PositionLeft = 185, PositionTop = 5 },
                        new { Id = 17, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_aster.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Ch.Aster", PositionLeft = 5, PositionTop = 545 },
                        new { Id = 18, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_sharp.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Ch.Sharp", PositionLeft = 185, PositionTop = 545 },
                        new { Id = 19, Code = "", Color = "#F92068", ControlSetId = 2, IconUrl = "images/icons/power.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)1, Name = "Power On", PositionLeft = 5, PositionTop = 5 },
                        new { Id = 20, Code = "", Color = "#6545C6", ControlSetId = 2, IconUrl = "images/icons/moon.png", IsAssignToggleOff = (byte)1, IsAssignToggleOn = (byte)0, Name = "Power Off", PositionLeft = 185, PositionTop = 5 },
                        new { Id = 21, Code = "", Color = "#9d9e9e", ControlSetId = 2, IconUrl = "images/icons/circle_plus.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Vol.Up", PositionLeft = 5, PositionTop = 95 },
                        new { Id = 22, Code = "", Color = "#9d9e9e", ControlSetId = 2, IconUrl = "images/icons/circle_minus.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Vol.Down", PositionLeft = 5, PositionTop = 185 },
                        new { Id = 23, Code = "", Color = "#9d9e9e", ControlSetId = 2, IconUrl = "images/icons/arrow2_up.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Ch.Up", PositionLeft = 185, PositionTop = 95 },
                        new { Id = 24, Code = "", Color = "#9d9e9e", ControlSetId = 2, IconUrl = "images/icons/arrow2_down.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Ch.Down", PositionLeft = 185, PositionTop = 185 },
                        new { Id = 25, Code = "", Color = "#9d9e9e", ControlSetId = 2, IconUrl = "images/icons/circle_play.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Play", PositionLeft = 95, PositionTop = 275 },
                        new { Id = 26, Code = "", Color = "#9d9e9e", ControlSetId = 2, IconUrl = "images/icons/darrow_right.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Next", PositionLeft = 185, PositionTop = 365 },
                        new { Id = 27, Code = "", Color = "#9d9e9e", ControlSetId = 2, IconUrl = "images/icons/darrow_left.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Prev", PositionLeft = 5, PositionTop = 365 },
                        new { Id = 28, Code = "", Color = "#9d9e9e", ControlSetId = 2, IconUrl = "images/icons/circle_pause.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Pause", PositionLeft = 95, PositionTop = 365 },
                        new { Id = 29, Code = "", Color = "#F92068", ControlSetId = 3, IconUrl = "images/icons/power.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)1, Name = "Power On", PositionLeft = 5, PositionTop = 5 },
                        new { Id = 30, Code = "", Color = "#6545C6", ControlSetId = 3, IconUrl = "images/icons/moon.png", IsAssignToggleOff = (byte)1, IsAssignToggleOn = (byte)0, Name = "Power Off", PositionLeft = 185, PositionTop = 5 },
                        new { Id = 31, Code = "", Color = "#9d9e9e", ControlSetId = 3, IconUrl = "images/icons/arrow2_up.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Up", PositionLeft = 95, PositionTop = 95 },
                        new { Id = 32, Code = "", Color = "#9d9e9e", ControlSetId = 3, IconUrl = "images/icons/arrow2_down.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Down", PositionLeft = 95, PositionTop = 185 },
                        new { Id = 33, Code = "", Color = "#F92068", ControlSetId = 4, IconUrl = "images/icons/power.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)1, Name = "Power On", PositionLeft = 5, PositionTop = 5 },
                        new { Id = 34, Code = "", Color = "#6545C6", ControlSetId = 4, IconUrl = "images/icons/moon.png", IsAssignToggleOff = (byte)1, IsAssignToggleOn = (byte)0, Name = "Power Off", PositionLeft = 185, PositionTop = 5 },
                        new { Id = 35, Code = "", Color = "#9d9e9e", ControlSetId = 4, IconUrl = "", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Temp.", PositionLeft = 95, PositionTop = 95 },
                        new { Id = 36, Code = "", Color = "#9d9e9e", ControlSetId = 4, IconUrl = "images/icons/settings2.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Select", PositionLeft = 5, PositionTop = 185 },
                        new { Id = 37, Code = "", Color = "#9d9e9e", ControlSetId = 4, IconUrl = "images/icons/arrow2_up.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Up", PositionLeft = 185, PositionTop = 95 },
                        new { Id = 38, Code = "", Color = "#9d9e9e", ControlSetId = 4, IconUrl = "images/icons/arrow2_down.png", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Down", PositionLeft = 185, PositionTop = 185 },
                        new { Id = 39, Code = "Temp", Color = "#F92068", ControlSetId = 5, IconUrl = "", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Temp.", PositionLeft = 185, PositionTop = 5 },
                        new { Id = 40, Code = "Humidity", Color = "#84bde8", ControlSetId = 5, IconUrl = "", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Humidity", PositionLeft = 5, PositionTop = 5 },
                        new { Id = 41, Code = "Voc", Color = "#81c03b", ControlSetId = 5, IconUrl = "", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "VOC", PositionLeft = 95, PositionTop = 95 },
                        new { Id = 42, Code = "Light", Color = "#fcc91f", ControlSetId = 5, IconUrl = "", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Light", PositionLeft = 5, PositionTop = 185 },
                        new { Id = 43, Code = "Noise", Color = "#B5743B", ControlSetId = 5, IconUrl = "", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Noise", PositionLeft = 185, PositionTop = 185 },
                        new { Id = 44, Code = "PowerOn", Color = "#F92068", ControlSetId = 6, IconUrl = "", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)1, Name = "Power On", PositionLeft = 5, PositionTop = 5 },
                        new { Id = 45, Code = "PowerOff", Color = "#9d9e9e", ControlSetId = 6, IconUrl = "", IsAssignToggleOff = (byte)1, IsAssignToggleOn = (byte)0, Name = "Power Off", PositionLeft = 185, PositionTop = 5 },
                        new { Id = 46, Code = "LightOn", Color = "#6545C6", ControlSetId = 6, IconUrl = "", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Light On", PositionLeft = 5, PositionTop = 95 },
                        new { Id = 47, Code = "LightOff", Color = "#9d9e9e", ControlSetId = 6, IconUrl = "", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Light Off", PositionLeft = 185, PositionTop = 95 },
                        new { Id = 48, Code = "PowerOn", Color = "#F92068", ControlSetId = 7, IconUrl = "", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)1, Name = "Power On", PositionLeft = 5, PositionTop = 5 },
                        new { Id = 49, Code = "PowerOff", Color = "#9d9e9e", ControlSetId = 7, IconUrl = "", IsAssignToggleOff = (byte)1, IsAssignToggleOn = (byte)0, Name = "Power Off", PositionLeft = 185, PositionTop = 5 },
                        new { Id = 50, Code = "Control", Color = "#9d9e9e", ControlSetId = 8, IconUrl = "", IsAssignToggleOff = (byte)0, IsAssignToggleOn = (byte)0, Name = "Control", PositionLeft = 95, PositionTop = 5 }
                    );
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.ControlSet", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int(11)");

                    b.Property<int?>("BrDeviceId")
                        .HasColumnType("int(11)");

                    b.Property<string>("Color")
                        .IsRequired()
                        .HasColumnType("varchar(255)")
                        .HasMaxLength(255);

                    b.Property<string>("IconUrl")
                        .HasColumnType("varchar(255)")
                        .HasMaxLength(255);

                    b.Property<byte>("IsMainPanelReady")
                        .HasColumnType("tinyint(1)");

                    b.Property<byte>("IsTemplate")
                        .HasColumnType("tinyint(1)");

                    b.Property<byte>("IsTogglable")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Name")
                        .HasColumnType("varchar(50)")
                        .HasMaxLength(50);

                    b.Property<byte>("OperationType")
                        .HasColumnType("tinyint(2)");

                    b.Property<int>("Order")
                        .HasColumnType("int(11)");

                    b.Property<byte>("ToggleState")
                        .HasColumnType("tinyint(1)");

                    b.HasKey("Id");

                    b.HasIndex("BrDeviceId");

                    b.ToTable("controlsets");

                    b.HasAnnotation("MySQL:Charset", "utf8");

                    b.HasAnnotation("MySQL:Collation", "utf8_general_ci ");

                    b.HasData(
                        new { Id = 1, Color = "#fcc91f", IconUrl = "images/icons/controlset/tv.png", IsMainPanelReady = (byte)1, IsTemplate = (byte)1, IsTogglable = (byte)1, Name = "TV", OperationType = (byte)1, Order = 99999, ToggleState = (byte)0 },
                        new { Id = 2, Color = "#F92068", IconUrl = "images/icons/controlset/av.png", IsMainPanelReady = (byte)1, IsTemplate = (byte)1, IsTogglable = (byte)1, Name = "AV", OperationType = (byte)1, Order = 99999, ToggleState = (byte)0 },
                        new { Id = 3, Color = "#ccdc4b", IconUrl = "images/icons/controlset/light.png", IsMainPanelReady = (byte)1, IsTemplate = (byte)1, IsTogglable = (byte)1, Name = "Light", OperationType = (byte)1, Order = 99999, ToggleState = (byte)0 },
                        new { Id = 4, Color = "#6545C6", IconUrl = "images/icons/controlset/aircompressor.png", IsMainPanelReady = (byte)1, IsTemplate = (byte)1, IsTogglable = (byte)1, Name = "Air Complessor", OperationType = (byte)1, Order = 99999, ToggleState = (byte)0 },
                        new { Id = 5, Color = "#84bde8", IconUrl = "images/icons/controlset/a1.png", IsMainPanelReady = (byte)1, IsTemplate = (byte)1, IsTogglable = (byte)0, Name = "A1 Sensor", OperationType = (byte)2, Order = 99999, ToggleState = (byte)0 },
                        new { Id = 6, Color = "#84bde8", IconUrl = "images/icons/controlset/sp2.png", IsMainPanelReady = (byte)1, IsTemplate = (byte)1, IsTogglable = (byte)1, Name = "Sp2 Switch", OperationType = (byte)2, Order = 99999, ToggleState = (byte)0 },
                        new { Id = 7, Color = "#84bde8", IconUrl = "images/icons/controlset/sp2.png", IsMainPanelReady = (byte)1, IsTemplate = (byte)1, IsTogglable = (byte)1, Name = "Sp1 Switch", OperationType = (byte)2, Order = 99999, ToggleState = (byte)0 },
                        new { Id = 8, Color = "#84bde8", IconUrl = "images/icons/controlset/sp2.png", IsMainPanelReady = (byte)1, IsTemplate = (byte)1, IsTogglable = (byte)1, Name = "Single Control", OperationType = (byte)2, Order = 99999, ToggleState = (byte)0 },
                        new { Id = 9, Color = "#84bde8", IconUrl = "images/icons/controlset/sp2.png", IsMainPanelReady = (byte)1, IsTemplate = (byte)1, IsTogglable = (byte)1, Name = "No Control", OperationType = (byte)2, Order = 99999, ToggleState = (byte)0 }
                    );
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.Job", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int(11)");

                    b.Property<DateTime>("Created")
                        .HasColumnType("datetime");

                    b.Property<byte>("IsCompleted")
                        .HasColumnType("tinyint(1)");

                    b.Property<byte>("IsError")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Json")
                        .HasColumnType("text")
                        .HasMaxLength(1000);

                    b.Property<string>("Message")
                        .HasColumnType("text")
                        .HasMaxLength(1000);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.Property<decimal>("Progress")
                        .HasColumnType("decimal(3, 2)");

                    b.Property<DateTime?>("Updated")
                        .HasColumnType("datetime");

                    b.HasKey("Id");

                    b.ToTable("jobs");

                    b.HasAnnotation("MySQL:Charset", "utf8");

                    b.HasAnnotation("MySQL:Collation", "utf8_general_ci ");
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.RemoteHost", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int(11)");

                    b.Property<string>("IpAddressString")
                        .HasColumnType("varchar(255)")
                        .HasMaxLength(255);

                    b.Property<string>("Name")
                        .HasColumnType("varchar(50)")
                        .HasMaxLength(50);

                    b.HasKey("Id");

                    b.ToTable("remotehost");

                    b.HasAnnotation("MySQL:Charset", "utf8");

                    b.HasAnnotation("MySQL:Collation", "utf8_general_ci ");
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.RemoteScript", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int(11)");

                    b.Property<int>("ControlId")
                        .HasColumnType("int(11)");

                    b.Property<int>("ControlSetId")
                        .HasColumnType("int(11)");

                    b.Property<string>("Name")
                        .HasColumnType("varchar(255)")
                        .HasMaxLength(255);

                    b.Property<int>("RemoteHostId")
                        .HasColumnType("int(11)");

                    b.HasKey("Id");

                    b.HasIndex("RemoteHostId");

                    b.ToTable("remotescripts");

                    b.HasAnnotation("MySQL:Charset", "utf8");

                    b.HasAnnotation("MySQL:Collation", "utf8_general_ci ");
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.Scene", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int(11)");

                    b.Property<string>("Color")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("IconUrl")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Name")
                        .HasColumnType("varchar(50)");

                    b.Property<int>("Order")
                        .HasColumnType("int(11)");

                    b.HasKey("Id");

                    b.ToTable("scenes");

                    b.HasAnnotation("MySQL:Charset", "utf8");

                    b.HasAnnotation("MySQL:Collation", "utf8_general_ci ");
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.SceneDetail", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int(11)");

                    b.Property<int>("ControlId")
                        .HasColumnType("int(11)");

                    b.Property<int>("ControlSetId")
                        .HasColumnType("int(11)");

                    b.Property<int>("Order")
                        .HasColumnType("int(11)");

                    b.Property<int>("SceneId")
                        .HasColumnType("int(11)");

                    b.Property<decimal>("WaitSecond")
                        .HasColumnType("decimal(6, 1)");

                    b.HasKey("Id");

                    b.HasIndex("ControlId");

                    b.HasIndex("ControlSetId");

                    b.HasIndex("SceneId");

                    b.ToTable("scenedetails");

                    b.HasAnnotation("MySQL:Charset", "utf8");

                    b.HasAnnotation("MySQL:Collation", "utf8_general_ci ");
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.Control", b =>
                {
                    b.HasOne("BroadlinkWeb.Models.Entities.ControlSet", "ControlSet")
                        .WithMany("Controls")
                        .HasForeignKey("ControlSetId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.ControlSet", b =>
                {
                    b.HasOne("BroadlinkWeb.Models.Entities.BrDevice", "BrDevice")
                        .WithMany()
                        .HasForeignKey("BrDeviceId");
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.RemoteScript", b =>
                {
                    b.HasOne("BroadlinkWeb.Models.Entities.RemoteHost", "RemoteHost")
                        .WithMany()
                        .HasForeignKey("RemoteHostId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.SceneDetail", b =>
                {
                    b.HasOne("BroadlinkWeb.Models.Entities.Control", "Control")
                        .WithMany()
                        .HasForeignKey("ControlId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("BroadlinkWeb.Models.Entities.ControlSet", "ControlSet")
                        .WithMany()
                        .HasForeignKey("ControlSetId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("BroadlinkWeb.Models.Entities.Scene", "Scene")
                        .WithMany("Details")
                        .HasForeignKey("SceneId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
