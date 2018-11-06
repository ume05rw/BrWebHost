﻿// <auto-generated />
using System;
using BroadlinkWeb.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace BroadlinkWeb.Migrations
{
    [DbContext(typeof(Dbc))]
    partial class DbcModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.4-rtm-31024");

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.A1Values", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AcquiredCount");

                    b.Property<int?>("BrDeviceId");

                    b.Property<DateTime>("Created");

                    b.Property<decimal>("Humidity");

                    b.Property<decimal>("Light");

                    b.Property<decimal>("Noise");

                    b.Property<DateTime>("Recorded");

                    b.Property<decimal>("Temperature");

                    b.Property<DateTime?>("Updated");

                    b.Property<decimal>("Voc");

                    b.HasKey("Id");

                    b.ToTable("a1sensors");
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.BrDevice", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("DeviceTypeDetailNumber");

                    b.Property<string>("IpAddressString")
                        .IsRequired();

                    b.Property<string>("MacAddressString")
                        .IsRequired();

                    b.Property<int>("Port");

                    b.HasKey("Id");

                    b.ToTable("brdevices");
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.Control", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Code")
                        .HasMaxLength(1000);

                    b.Property<string>("Color")
                        .IsRequired()
                        .HasMaxLength(255);

                    b.Property<int>("ControlSetId");

                    b.Property<string>("IconUrl")
                        .HasMaxLength(255);

                    b.Property<bool>("IsAssignToggleOff");

                    b.Property<bool>("IsAssignToggleOn");

                    b.Property<string>("Name")
                        .HasMaxLength(50);

                    b.Property<int>("PositionLeft");

                    b.Property<int>("PositionTop");

                    b.HasKey("Id");

                    b.HasIndex("ControlSetId");

                    b.ToTable("controls");

                    b.HasData(
                        new { Id = 1, Code = "", Color = "#F92068", ControlSetId = 1, IconUrl = "images/icons/power.png", IsAssignToggleOff = true, IsAssignToggleOn = true, Name = "Power", PositionLeft = 5, PositionTop = 5 },
                        new { Id = 2, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_0.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Ch.0", PositionLeft = 95, PositionTop = 545 },
                        new { Id = 3, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_9.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Ch.9", PositionLeft = 185, PositionTop = 455 },
                        new { Id = 4, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_8.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Ch.8", PositionLeft = 95, PositionTop = 455 },
                        new { Id = 5, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_7.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Ch.7", PositionLeft = 5, PositionTop = 455 },
                        new { Id = 6, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_6.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Ch.6", PositionLeft = 185, PositionTop = 365 },
                        new { Id = 7, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_5.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Ch.5", PositionLeft = 95, PositionTop = 365 },
                        new { Id = 8, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_4.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Ch.4", PositionLeft = 5, PositionTop = 365 },
                        new { Id = 9, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_3.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Ch.3", PositionLeft = 185, PositionTop = 275 },
                        new { Id = 10, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_2.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Ch.2", PositionLeft = 95, PositionTop = 275 },
                        new { Id = 11, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_1.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Ch.1", PositionLeft = 5, PositionTop = 275 },
                        new { Id = 12, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/circle_minus.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Vol.Down", PositionLeft = 5, PositionTop = 185 },
                        new { Id = 13, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/circle_plus.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Vol.Up", PositionLeft = 5, PositionTop = 95 },
                        new { Id = 14, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/arrow2_down.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Ch.Down", PositionLeft = 185, PositionTop = 185 },
                        new { Id = 15, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/arrow2_up.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Ch.Up", PositionLeft = 185, PositionTop = 95 },
                        new { Id = 16, Code = "", Color = "#84bde8", ControlSetId = 1, IconUrl = "images/icons/settings2.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Input Select", PositionLeft = 185, PositionTop = 5 },
                        new { Id = 17, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_aster.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Ch.Aster", PositionLeft = 5, PositionTop = 545 },
                        new { Id = 18, Code = "", Color = "#9d9e9e", ControlSetId = 1, IconUrl = "images/icons/num_sharp.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Ch.Sharp", PositionLeft = 185, PositionTop = 545 },
                        new { Id = 19, Code = "", Color = "#F92068", ControlSetId = 2, IconUrl = "images/icons/power.png", IsAssignToggleOff = false, IsAssignToggleOn = true, Name = "Power On", PositionLeft = 5, PositionTop = 5 },
                        new { Id = 20, Code = "", Color = "#6545C6", ControlSetId = 2, IconUrl = "images/icons/moon.png", IsAssignToggleOff = true, IsAssignToggleOn = false, Name = "Power Off", PositionLeft = 185, PositionTop = 5 },
                        new { Id = 21, Code = "", Color = "#9d9e9e", ControlSetId = 2, IconUrl = "images/icons/circle_plus.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Vol.Up", PositionLeft = 5, PositionTop = 95 },
                        new { Id = 22, Code = "", Color = "#9d9e9e", ControlSetId = 2, IconUrl = "images/icons/circle_minus.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Vol.Down", PositionLeft = 5, PositionTop = 185 },
                        new { Id = 23, Code = "", Color = "#9d9e9e", ControlSetId = 2, IconUrl = "images/icons/arrow2_up.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Ch.Up", PositionLeft = 185, PositionTop = 95 },
                        new { Id = 24, Code = "", Color = "#9d9e9e", ControlSetId = 2, IconUrl = "images/icons/arrow2_down.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Ch.Down", PositionLeft = 185, PositionTop = 185 },
                        new { Id = 25, Code = "", Color = "#9d9e9e", ControlSetId = 2, IconUrl = "images/icons/circle_play.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Play", PositionLeft = 95, PositionTop = 275 },
                        new { Id = 26, Code = "", Color = "#9d9e9e", ControlSetId = 2, IconUrl = "images/icons/darrow_right.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Next", PositionLeft = 185, PositionTop = 365 },
                        new { Id = 27, Code = "", Color = "#9d9e9e", ControlSetId = 2, IconUrl = "images/icons/darrow_left.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Prev", PositionLeft = 5, PositionTop = 365 },
                        new { Id = 28, Code = "", Color = "#9d9e9e", ControlSetId = 2, IconUrl = "images/icons/circle_pause.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Pause", PositionLeft = 95, PositionTop = 365 },
                        new { Id = 29, Code = "", Color = "#F92068", ControlSetId = 3, IconUrl = "images/icons/power.png", IsAssignToggleOff = false, IsAssignToggleOn = true, Name = "Power On", PositionLeft = 5, PositionTop = 5 },
                        new { Id = 30, Code = "", Color = "#6545C6", ControlSetId = 3, IconUrl = "images/icons/moon.png", IsAssignToggleOff = true, IsAssignToggleOn = false, Name = "Power Off", PositionLeft = 185, PositionTop = 5 },
                        new { Id = 31, Code = "", Color = "#9d9e9e", ControlSetId = 3, IconUrl = "images/icons/arrow2_up.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Up", PositionLeft = 95, PositionTop = 95 },
                        new { Id = 32, Code = "", Color = "#9d9e9e", ControlSetId = 3, IconUrl = "images/icons/arrow2_down.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Down", PositionLeft = 95, PositionTop = 185 },
                        new { Id = 33, Code = "", Color = "#F92068", ControlSetId = 4, IconUrl = "images/icons/power.png", IsAssignToggleOff = false, IsAssignToggleOn = true, Name = "Power On", PositionLeft = 5, PositionTop = 5 },
                        new { Id = 34, Code = "", Color = "#6545C6", ControlSetId = 4, IconUrl = "images/icons/moon.png", IsAssignToggleOff = true, IsAssignToggleOn = false, Name = "Power Off", PositionLeft = 185, PositionTop = 5 },
                        new { Id = 35, Code = "", Color = "#9d9e9e", ControlSetId = 4, IconUrl = "", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Temp.", PositionLeft = 95, PositionTop = 95 },
                        new { Id = 36, Code = "", Color = "#9d9e9e", ControlSetId = 4, IconUrl = "images/icons/settings2.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Select", PositionLeft = 5, PositionTop = 185 },
                        new { Id = 37, Code = "", Color = "#9d9e9e", ControlSetId = 4, IconUrl = "images/icons/arrow2_up.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Up", PositionLeft = 185, PositionTop = 95 },
                        new { Id = 38, Code = "", Color = "#9d9e9e", ControlSetId = 4, IconUrl = "images/icons/arrow2_down.png", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Down", PositionLeft = 185, PositionTop = 185 },
                        new { Id = 39, Code = "Temp", Color = "#F92068", ControlSetId = 5, IconUrl = "", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Temp.", PositionLeft = 185, PositionTop = 5 },
                        new { Id = 40, Code = "Humidity", Color = "#84bde8", ControlSetId = 5, IconUrl = "", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Humidity", PositionLeft = 5, PositionTop = 5 },
                        new { Id = 41, Code = "Voc", Color = "#81c03b", ControlSetId = 5, IconUrl = "", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "VOC", PositionLeft = 95, PositionTop = 95 },
                        new { Id = 42, Code = "Light", Color = "#fcc91f", ControlSetId = 5, IconUrl = "", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Light", PositionLeft = 5, PositionTop = 185 },
                        new { Id = 43, Code = "Noise", Color = "#B5743B", ControlSetId = 5, IconUrl = "", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Noise", PositionLeft = 185, PositionTop = 185 },
                        new { Id = 44, Code = "PowerOn", Color = "#F92068", ControlSetId = 6, IconUrl = "", IsAssignToggleOff = false, IsAssignToggleOn = true, Name = "Power On", PositionLeft = 5, PositionTop = 5 },
                        new { Id = 45, Code = "PowerOff", Color = "#9d9e9e", ControlSetId = 6, IconUrl = "", IsAssignToggleOff = true, IsAssignToggleOn = false, Name = "Power Off", PositionLeft = 185, PositionTop = 5 },
                        new { Id = 46, Code = "LightOn", Color = "#6545C6", ControlSetId = 6, IconUrl = "", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Light On", PositionLeft = 5, PositionTop = 95 },
                        new { Id = 47, Code = "LightOff", Color = "#9d9e9e", ControlSetId = 6, IconUrl = "", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Light Off", PositionLeft = 185, PositionTop = 95 },
                        new { Id = 48, Code = "PowerOn", Color = "#F92068", ControlSetId = 7, IconUrl = "", IsAssignToggleOff = false, IsAssignToggleOn = true, Name = "Power On", PositionLeft = 5, PositionTop = 5 },
                        new { Id = 49, Code = "PowerOff", Color = "#9d9e9e", ControlSetId = 7, IconUrl = "", IsAssignToggleOff = true, IsAssignToggleOn = false, Name = "Power Off", PositionLeft = 185, PositionTop = 5 },
                        new { Id = 50, Code = "Control", Color = "#9d9e9e", ControlSetId = 8, IconUrl = "", IsAssignToggleOff = false, IsAssignToggleOn = false, Name = "Control", PositionLeft = 95, PositionTop = 5 }
                    );
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.ControlSet", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("BrDeviceId");

                    b.Property<string>("Color")
                        .IsRequired()
                        .HasMaxLength(255);

                    b.Property<string>("IconUrl")
                        .HasMaxLength(255);

                    b.Property<bool>("IsMainPanelReady");

                    b.Property<bool>("IsTemplate");

                    b.Property<bool>("IsTogglable");

                    b.Property<string>("Name")
                        .HasMaxLength(50);

                    b.Property<int>("OperationType");

                    b.Property<int>("Order");

                    b.Property<bool>("ToggleState");

                    b.HasKey("Id");

                    b.HasIndex("BrDeviceId");

                    b.ToTable("controlsets");

                    b.HasData(
                        new { Id = 1, Color = "#fcc91f", IconUrl = "images/icons/operation/large/tv.png", IsMainPanelReady = true, IsTemplate = true, IsTogglable = true, Name = "TV", OperationType = 1, Order = 99999, ToggleState = false },
                        new { Id = 2, Color = "#F92068", IconUrl = "images/icons/operation/large/av.png", IsMainPanelReady = true, IsTemplate = true, IsTogglable = true, Name = "AV", OperationType = 1, Order = 99999, ToggleState = false },
                        new { Id = 3, Color = "#ccdc4b", IconUrl = "images/icons/operation/large/light.png", IsMainPanelReady = true, IsTemplate = true, IsTogglable = true, Name = "Light", OperationType = 1, Order = 99999, ToggleState = false },
                        new { Id = 4, Color = "#6545C6", IconUrl = "images/icons/operation/large/aircompressor.png", IsMainPanelReady = true, IsTemplate = true, IsTogglable = true, Name = "Air Complessor", OperationType = 1, Order = 99999, ToggleState = false },
                        new { Id = 5, Color = "#84bde8", IconUrl = "images/icons/operation/large/a1.png", IsMainPanelReady = true, IsTemplate = true, IsTogglable = false, Name = "A1 Sensor", OperationType = 2, Order = 99999, ToggleState = false },
                        new { Id = 6, Color = "#84bde8", IconUrl = "images/icons/operation/large/sp2.png", IsMainPanelReady = true, IsTemplate = true, IsTogglable = true, Name = "Sp2 Switch", OperationType = 2, Order = 99999, ToggleState = false },
                        new { Id = 7, Color = "#84bde8", IconUrl = "images/icons/operation/large/sp2.png", IsMainPanelReady = true, IsTemplate = true, IsTogglable = true, Name = "Sp1 Switch", OperationType = 2, Order = 99999, ToggleState = false },
                        new { Id = 8, Color = "#84bde8", IconUrl = "images/icons/operation/large/sp2.png", IsMainPanelReady = true, IsTemplate = true, IsTogglable = true, Name = "Single Control", OperationType = 2, Order = 99999, ToggleState = false },
                        new { Id = 9, Color = "#84bde8", IconUrl = "images/icons/operation/large/sp2.png", IsMainPanelReady = true, IsTemplate = true, IsTogglable = true, Name = "No Control", OperationType = 2, Order = 99999, ToggleState = false }
                    );
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.Job", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("Created");

                    b.Property<bool>("IsCompleted");

                    b.Property<bool>("IsError");

                    b.Property<string>("Json")
                        .HasMaxLength(1000);

                    b.Property<string>("Message")
                        .HasMaxLength(1000);

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<decimal>("Progress");

                    b.Property<DateTime?>("Updated");

                    b.HasKey("Id");

                    b.ToTable("jobs");
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.RemoteHost", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("IpAddressString")
                        .HasMaxLength(255);

                    b.Property<string>("Name")
                        .HasMaxLength(50);

                    b.HasKey("Id");

                    b.ToTable("remotehosts");
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.RemoteScript", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("ControlId");

                    b.Property<string>("Name")
                        .HasMaxLength(255);

                    b.Property<int>("RemoteHostId");

                    b.HasKey("Id");

                    b.HasIndex("RemoteHostId");

                    b.ToTable("remotescripts");
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.Scene", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Color")
                        .IsRequired();

                    b.Property<string>("IconUrl");

                    b.Property<string>("Name");

                    b.Property<int>("Order");

                    b.HasKey("Id");

                    b.ToTable("scenes");
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.SceneDetail", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("ControlId");

                    b.Property<int>("ControlSetId");

                    b.Property<int>("Order");

                    b.Property<int>("SceneId");

                    b.Property<decimal>("WaitSecond");

                    b.HasKey("Id");

                    b.HasIndex("ControlId");

                    b.HasIndex("ControlSetId");

                    b.HasIndex("SceneId");

                    b.ToTable("scenedetails");
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.Schedule", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Color")
                        .IsRequired();

                    b.Property<int?>("ControlId");

                    b.Property<int?>("ControlSetId");

                    b.Property<int?>("CurrentJobId");

                    b.Property<bool>("Enabled");

                    b.Property<string>("IconUrl");

                    b.Property<string>("Name");

                    b.Property<DateTime?>("NextDateTime");

                    b.Property<int>("Order");

                    b.Property<int?>("SceneId");

                    b.Property<DateTime>("StartTime");

                    b.Property<string>("WeekdayFlags")
                        .HasMaxLength(7);

                    b.HasKey("Id");

                    b.HasIndex("ControlId");

                    b.HasIndex("ControlSetId");

                    b.HasIndex("CurrentJobId");

                    b.HasIndex("SceneId");

                    b.ToTable("schedules");
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

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.Schedule", b =>
                {
                    b.HasOne("BroadlinkWeb.Models.Entities.Control", "Control")
                        .WithMany()
                        .HasForeignKey("ControlId");

                    b.HasOne("BroadlinkWeb.Models.Entities.ControlSet", "ControlSet")
                        .WithMany()
                        .HasForeignKey("ControlSetId");

                    b.HasOne("BroadlinkWeb.Models.Entities.Job", "CurrentJob")
                        .WithMany()
                        .HasForeignKey("CurrentJobId");

                    b.HasOne("BroadlinkWeb.Models.Entities.Scene", "Scene")
                        .WithMany()
                        .HasForeignKey("SceneId");
                });
#pragma warning restore 612, 618
        }
    }
}
