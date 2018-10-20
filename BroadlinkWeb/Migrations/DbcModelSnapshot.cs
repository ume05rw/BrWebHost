﻿// <auto-generated />
using BroadlinkWeb.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.Data.EntityFrameworkCore.Storage.Internal;
using System;

namespace BroadlinkWeb.Migrations
{
    [DbContext(typeof(Dbc))]
    partial class DbcModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.3-rtm-10026");

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
                        .HasColumnType("text");

                    b.Property<string>("Color")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<int>("ControlSetId")
                        .HasColumnType("int(11)");

                    b.Property<string>("HoverColor")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("IconUrl")
                        .HasColumnType("varchar(255)");

                    b.Property<bool>("IsAssignToggleOff")
                        .HasColumnType("tinyint(1)");

                    b.Property<bool>("IsAssignToggleOn")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.Property<string>("PositionLeft")
                        .IsRequired()
                        .HasColumnType("int(11)");

                    b.Property<string>("PositionTop")
                        .IsRequired()
                        .HasColumnType("int(11)");

                    b.HasKey("Id");

                    b.HasIndex("ControlSetId");

                    b.ToTable("controls");

                    b.HasAnnotation("MySQL:Charset", "utf8");

                    b.HasAnnotation("MySQL:Collation", "utf8_general_ci ");
                });

            modelBuilder.Entity("BroadlinkWeb.Models.Entities.ControlSet", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int(11)");

                    b.Property<int?>("BrDeviceId")
                        .HasColumnType("int(11)");

                    b.Property<bool>("IsTemplate")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("varchar(50)");

                    b.HasKey("Id");

                    b.HasIndex("BrDeviceId");

                    b.ToTable("controlsets");

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
#pragma warning restore 612, 618
        }
    }
}
