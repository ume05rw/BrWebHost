using BroadlinkWeb.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BroadlinkWeb.Models
{
    /// <summary>
    /// DbContext class
    /// </summary>
    public class Dbc : DbContext
    {
        public DbSet<BrDevice> BrDevices { get; set; }

        public DbSet<ControlSet> ControlSets { get; set; }

        public DbSet<Control> Controls { get; set; }

        public DbSet<Scene> Scenes { get; set; }

        public DbSet<SceneDetail> SceneDetails { get; set; }

        public DbSet<RemoteHost> RemoteHosts { get; set; }

        public DbSet<Job> Jobs { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="options"></param>
        public Dbc(DbContextOptions<Dbc> options)
            : base(options)
        {
            Xb.Util.Out("Dbc.Constructor");
        }


        public override void Dispose()
        {
            Xb.Util.Out("Dbc.Dispose");
            base.Dispose();
        }



        /// <summary>
        /// シード生成
        /// </summary>
        /// <param name="modelBuilder"></param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ControlSet>().HasData(
                new ControlSet
                {
                    Id = 1,
                    BrDeviceId = null,
                    Name = "TV",
                    Color = "#fcc91f",
                    IconUrl = "images/icons/controlset/tv.png",

                    Order = 99999,
                    ToggleState = false,
                    IsMainPanelReady = true,
                    IsTogglable = true,
                    OperationType = OperationType.RemoteControl,
                    IsTemplate = true
                },
                new ControlSet
                {
                    Id = 2,
                    BrDeviceId = null,
                    Name = "AV",
                    Color = "#F92068",
                    IconUrl = "images/icons/controlset/av.png",
                    Order = 99999,
                    ToggleState = false,
                    IsMainPanelReady = true,
                    IsTogglable = true,
                    OperationType = OperationType.RemoteControl,
                    IsTemplate = true
                },
                new ControlSet
                {
                    Id = 3,
                    BrDeviceId = null,
                    Name = "Light",
                    Color = "#ccdc4b",
                    IconUrl = "images/icons/controlset/light.png",
                    Order = 99999,
                    ToggleState = false,
                    IsMainPanelReady = true,
                    IsTogglable = true,
                    OperationType = OperationType.RemoteControl,
                    IsTemplate = true
                },
                new ControlSet
                {
                    Id = 4,
                    BrDeviceId = null,
                    Name = "Air Complessor",
                    IconUrl = "images/icons/controlset/aircompressor.png",
                    Order = 99999,
                    ToggleState = false,
                    IsMainPanelReady = true,
                    IsTogglable = true,
                    OperationType = OperationType.RemoteControl,
                    Color = "#6545C6",
                    IsTemplate = true
                },
                new ControlSet
                {
                    Id = 5,
                    BrDeviceId = null,
                    Name = "A1 Sensor",
                    IconUrl = "images/icons/controlset/a1.png",
                    Order = 99999,
                    ToggleState = false,
                    IsMainPanelReady = true,
                    IsTogglable = false,
                    OperationType = OperationType.BroadlinkDevice,
                    Color = "#84bde8",
                    IsTemplate = true
                },
                new ControlSet
                {
                    Id = 6,
                    BrDeviceId = null,
                    Name = "Sp2 Switch",
                    IconUrl = "images/icons/controlset/sp2.png",
                    Order = 99999,
                    ToggleState = false,
                    IsMainPanelReady = true,
                    IsTogglable = true,
                    OperationType = OperationType.BroadlinkDevice,
                    Color = "#84bde8",
                    IsTemplate = true
                },
                new ControlSet
                {
                    Id = 7,
                    BrDeviceId = null,
                    Name = "Sp1 Switch",
                    IconUrl = "images/icons/controlset/sp2.png",
                    Order = 99999,
                    ToggleState = false,
                    IsMainPanelReady = true,
                    IsTogglable = true,
                    OperationType = OperationType.BroadlinkDevice,
                    Color = "#84bde8",
                    IsTemplate = true
                },
                new ControlSet
                {
                    Id = 8,
                    BrDeviceId = null,
                    Name = "Single Control",
                    IconUrl = "images/icons/controlset/sp2.png",
                    Order = 99999,
                    ToggleState = false,
                    IsMainPanelReady = true,
                    IsTogglable = true,
                    OperationType = OperationType.BroadlinkDevice,
                    Color = "#84bde8",
                    IsTemplate = true
                },
                new ControlSet
                {
                    Id = 9,
                    BrDeviceId = null,
                    Name = "No Control",
                    IconUrl = "images/icons/controlset/sp2.png",
                    Order = 99999,
                    ToggleState = false,
                    IsMainPanelReady = true,
                    IsTogglable = true,
                    OperationType = OperationType.BroadlinkDevice,
                    Color = "#84bde8",
                    IsTemplate = true
                }
            );

            modelBuilder.Entity<Control>().HasData(

                // 1.TV
                new Control
                {
                    Id = 1,
                    Code = "",
                    Color = "#F92068",
                    ControlSetId = 1,
                    IconUrl = "images/icons/power.png",
                    IsAssignToggleOff = true,
                    IsAssignToggleOn = true,
                    Name = "Power",
                    PositionLeft = 5,
                    PositionTop = 5
                },
                new Control
                {
                    Id = 2,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 1,
                    IconUrl = "images/icons/num_0.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Ch.0",
                    PositionLeft = 95,
                    PositionTop = 545
                },
                new Control
                {
                    Id = 3,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 1,
                    IconUrl = "images/icons/num_9.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Ch.9",
                    PositionLeft = 185,
                    PositionTop = 455
                },
                new Control
                {
                    Id = 4,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 1,
                    IconUrl = "images/icons/num_8.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Ch.8",
                    PositionLeft = 95,
                    PositionTop = 455
                },
                new Control
                {
                    Id = 5,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 1,
                    IconUrl = "images/icons/num_7.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Ch.7",
                    PositionLeft = 5,
                    PositionTop = 455
                },
                new Control
                {
                    Id = 6,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 1,
                    IconUrl = "images/icons/num_6.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Ch.6",
                    PositionLeft = 185,
                    PositionTop = 365
                },
                new Control
                {
                    Id = 7,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 1,
                    IconUrl = "images/icons/num_5.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Ch.5",
                    PositionLeft = 95,
                    PositionTop = 365
                },
                new Control
                {
                    Id = 8,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 1,
                    IconUrl = "images/icons/num_4.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Ch.4",
                    PositionLeft = 5,
                    PositionTop = 365
                },
                new Control
                {
                    Id = 9,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 1,
                    IconUrl = "images/icons/num_3.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Ch.3",
                    PositionLeft = 185,
                    PositionTop = 275
                },
                new Control
                {
                    Id = 10,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 1,
                    IconUrl = "images/icons/num_2.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Ch.2",
                    PositionLeft = 95,
                    PositionTop = 275
                },
                new Control
                {
                    Id = 11,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 1,
                    IconUrl = "images/icons/num_1.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Ch.1",
                    PositionLeft = 5,
                    PositionTop = 275
                },
                new Control
                {
                    Id = 12,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 1,
                    IconUrl = "images/icons/circle_minus.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Vol.Down",
                    PositionLeft = 5,
                    PositionTop = 185
                },
                new Control
                {
                    Id = 13,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 1,
                    IconUrl = "images/icons/circle_plus.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Vol.Up",
                    PositionLeft = 5,
                    PositionTop = 95
                },
                new Control
                {
                    Id = 14,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 1,
                    IconUrl = "images/icons/arrow2_down.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Ch.Down",
                    PositionLeft = 185,
                    PositionTop = 185
                },
                new Control
                {
                    Id = 15,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 1,
                    IconUrl = "images/icons/arrow2_up.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Ch.Up",
                    PositionLeft = 185,
                    PositionTop = 95
                },
                new Control
                {
                    Id = 16,
                    Code = "",
                    Color = "#84bde8",
                    ControlSetId = 1,
                    IconUrl = "images/icons/settings2.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Input Select",
                    PositionLeft = 185,
                    PositionTop = 5
                },
                new Control
                {
                    Id = 17,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 1,
                    IconUrl = "images/icons/num_aster.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Ch.Aster",
                    PositionLeft = 5,
                    PositionTop = 545
                },
                new Control
                {
                    Id = 18,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 1,
                    IconUrl = "images/icons/num_sharp.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Ch.Sharp",
                    PositionLeft = 185,
                    PositionTop = 545
                },

                // 2.AV
                new Control
                {
                    Id = 19,
                    Code = "",
                    Color = "#F92068",
                    ControlSetId = 2,
                    IconUrl = "images/icons/power.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = true,
                    Name = "Power On",
                    PositionLeft = 5,
                    PositionTop = 5
                },
                new Control
                {
                    Id = 20,
                    Code = "",
                    Color = "#6545C6",
                    ControlSetId = 2,
                    IconUrl = "images/icons/moon.png",
                    IsAssignToggleOff = true,
                    IsAssignToggleOn = false,
                    Name = "Power Off",
                    PositionLeft = 185,
                    PositionTop = 5
                },
                new Control
                {
                    Id = 21,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 2,
                    IconUrl = "images/icons/circle_plus.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Vol.Up",
                    PositionLeft = 5,
                    PositionTop = 95
                },
                new Control
                {
                    Id = 22,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 2,
                    IconUrl = "images/icons/circle_minus.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Vol.Down",
                    PositionLeft = 5,
                    PositionTop = 185
                },
                new Control
                {
                    Id = 23,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 2,
                    IconUrl = "images/icons/arrow2_up.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Ch.Up",
                    PositionLeft = 185,
                    PositionTop = 95
                },
                new Control
                {
                    Id = 24,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 2,
                    IconUrl = "images/icons/arrow2_down.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Ch.Down",
                    PositionLeft = 185,
                    PositionTop = 185
                },
                new Control
                {
                    Id = 25,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 2,
                    IconUrl = "images/icons/circle_play.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Play",
                    PositionLeft = 95,
                    PositionTop = 275
                },
                new Control
                {
                    Id = 26,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 2,
                    IconUrl = "images/icons/darrow_right.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Next",
                    PositionLeft = 185,
                    PositionTop = 365
                },
                new Control
                {
                    Id = 27,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 2,
                    IconUrl = "images/icons/darrow_left.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Prev",
                    PositionLeft = 5,
                    PositionTop = 365
                },
                new Control
                {
                    Id = 28,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 2,
                    IconUrl = "images/icons/circle_pause.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Pause",
                    PositionLeft = 95,
                    PositionTop = 365
                },

                // 3.Light
                new Control
                {
                    Id = 29,
                    Code = "",
                    Color = "#F92068",
                    ControlSetId = 3,
                    IconUrl = "images/icons/power.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = true,
                    Name = "Power On",
                    PositionLeft = 5,
                    PositionTop = 5
                },
                new Control
                {
                    Id = 30,
                    Code = "",
                    Color = "#6545C6",
                    ControlSetId = 3,
                    IconUrl = "images/icons/moon.png",
                    IsAssignToggleOff = true,
                    IsAssignToggleOn = false,
                    Name = "Power Off",
                    PositionLeft = 185,
                    PositionTop = 5
                },
                new Control
                {
                    Id = 31,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 3,
                    IconUrl = "images/icons/arrow2_up.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Up",
                    PositionLeft = 95,
                    PositionTop = 95
                },
                new Control
                {
                    Id = 32,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 3,
                    IconUrl = "images/icons/arrow2_down.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Down",
                    PositionLeft = 95,
                    PositionTop = 185
                },

                // 4.Air Compressor
                new Control
                {
                    Id = 33,
                    Code = "",
                    Color = "#F92068",
                    ControlSetId = 4,
                    IconUrl = "images/icons/power.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = true,
                    Name = "Power On",
                    PositionLeft = 5,
                    PositionTop = 5
                },
                new Control
                {
                    Id = 34,
                    Code = "",
                    Color = "#6545C6",
                    ControlSetId = 4,
                    IconUrl = "images/icons/moon.png",
                    IsAssignToggleOff = true,
                    IsAssignToggleOn = false,
                    Name = "Power Off",
                    PositionLeft = 185,
                    PositionTop = 5
                },
                new Control
                {
                    Id = 35,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 4,
                    IconUrl = "",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Temp.",
                    PositionLeft = 95,
                    PositionTop = 95
                },
                new Control
                {
                    Id = 36,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 4,
                    IconUrl = "images/icons/settings2.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Select",
                    PositionLeft = 5,
                    PositionTop = 185
                },
                new Control
                {
                    Id = 37,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 4,
                    IconUrl = "images/icons/arrow2_up.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Up",
                    PositionLeft = 185,
                    PositionTop = 95
                },
                new Control
                {
                    Id = 38,
                    Code = "",
                    Color = "#9d9e9e",
                    ControlSetId = 4,
                    IconUrl = "images/icons/arrow2_down.png",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Down",
                    PositionLeft = 185,
                    PositionTop = 185
                },

                // 5.A1 Sensor
                new Control
                {
                    Id = 39,
                    Code = "Temp",
                    Color = "#F92068",
                    ControlSetId = 5,
                    IconUrl = "",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Temp.",
                    PositionLeft = 185,
                    PositionTop = 5
                },
                new Control
                {
                    Id = 40,
                    Code = "Humidity",
                    Color = "#84bde8",
                    ControlSetId = 5,
                    IconUrl = "",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Humidity",
                    PositionLeft = 5,
                    PositionTop = 5
                },
                new Control
                {
                    Id = 41,
                    Code = "Voc",
                    Color = "#81c03b",
                    ControlSetId = 5,
                    IconUrl = "",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "VOC",
                    PositionLeft = 95,
                    PositionTop = 95
                },
                new Control
                {
                    Id = 42,
                    Code = "Light",
                    Color = "#fcc91f",
                    ControlSetId = 5,
                    IconUrl = "",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Light",
                    PositionLeft = 5,
                    PositionTop = 185
                },
                new Control
                {
                    Id = 43,
                    Code = "Noise",
                    Color = "#B5743B",
                    ControlSetId = 5,
                    IconUrl = "",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Noise",
                    PositionLeft = 185,
                    PositionTop = 185
                },

                // 6.SP2 Switch
                new Control
                {
                    Id = 44,
                    Code = "PowerOn",
                    Color = "#F92068",
                    ControlSetId = 6,
                    IconUrl = "",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = true,
                    Name = "Power On",
                    PositionLeft = 5,
                    PositionTop = 5
                },
                new Control
                {
                    Id = 45,
                    Code = "PowerOff",
                    Color = "#9d9e9e",
                    ControlSetId = 6,
                    IconUrl = "",
                    IsAssignToggleOff = true,
                    IsAssignToggleOn = false,
                    Name = "Power Off",
                    PositionLeft = 185,
                    PositionTop = 5
                },
                new Control
                {
                    Id = 46,
                    Code = "LightOn",
                    Color = "#6545C6",
                    ControlSetId = 6,
                    IconUrl = "",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Light On",
                    PositionLeft = 5,
                    PositionTop = 95
                },
                new Control
                {
                    Id = 47,
                    Code = "LightOff",
                    Color = "#9d9e9e",
                    ControlSetId = 6,
                    IconUrl = "",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Light Off",
                    PositionLeft = 185,
                    PositionTop = 95
                },

                // 7. Sp1 Switch
                new Control
                {
                    Id = 48,
                    Code = "PowerOn",
                    Color = "#F92068",
                    ControlSetId = 7,
                    IconUrl = "",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = true,
                    Name = "Power On",
                    PositionLeft = 5,
                    PositionTop = 5
                },
                new Control
                {
                    Id = 49,
                    Code = "PowerOff",
                    Color = "#9d9e9e",
                    ControlSetId = 7,
                    IconUrl = "",
                    IsAssignToggleOff = true,
                    IsAssignToggleOn = false,
                    Name = "Power Off",
                    PositionLeft = 185,
                    PositionTop = 5
                },

                // 8.Single Control
                new Control
                {
                    Id = 50,
                    Code = "Control",
                    Color = "#9d9e9e",
                    ControlSetId = 8,
                    IconUrl = "",
                    IsAssignToggleOff = false,
                    IsAssignToggleOn = false,
                    Name = "Control",
                    PositionLeft = 95,
                    PositionTop = 5
                }
            );
        }
    }
}
