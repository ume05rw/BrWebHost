using MySql.Data.EntityFrameworkCore.DataAnnotations;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BroadlinkWeb.Models.Entities
{
    [Table("schedules")]
    //[MySqlCharset("utf8")]
    //[MySqlCollation("utf8_general_ci ")]
    public class Schedule
    {
        [Key]
        //[Column(Order = 0, TypeName = "int(11)")] // Orderプロパティは、EFCore未サポート
        [Description("Schedule ID")] // Description属性は、EFCore未サポート
        public int Id { get; set; }

        //[Column(Order = 1, TypeName = "varchar(50)")]
        [Description("Schedule Name")]
        public string Name { get; set; }

        //[Column(Order = 0, TypeName = "int(11)")]
        [Description("Scene ID")]
        public int? SceneId { get; set; }

        //[Column(Order = 0, TypeName = "int(11)")]
        [Description("ControlSet ID")]
        public int? ControlSetId { get; set; }

        //[Column(Order = 0, TypeName = "int(11)")]
        [Description("Control ID")]
        public int? ControlId { get; set; }

        //[Column(Order = 0, TypeName = "int(11)")]
        [Description("Job ID")]
        public int? CurrentJobId { get; set; }

        //[Column(Order = 9, TypeName = "datetime")]
        [Description("Schedule Enable Flag")]
        public bool Enabled { get; set; }

        //[Column(Order = 9, TypeName = "datetime")]
        [Description("Schedule Start Time")]
        [DataType(DataType.DateTime)]
        public DateTime StartTime { get; set; }

        //[Column(Order = 2, TypeName = "varchar(255)")]
        [Description("Weekday Enable Flag, Sunday Start, Saturday End")]
        [StringLength(7),MinLength(7), MaxLength(7)]
        public string WeekdayFlags { get; set; } = "1111111";

        //[Column(Order = 9, TypeName = "datetime")]
        [Description("Next Kick Date Time")]
        [DataType(DataType.DateTime)]
        public DateTime? NextDateTime { get; set; }

        public bool GetWeekdayFlag(DayOfWeek dayOfWeek)
        {
            if (this.WeekdayFlags.Length != 7)
                throw new Exception("WeekdayFlags Fromat Failure");

            var index = (int)dayOfWeek;
            return (this.WeekdayFlags[index] == '1');
        }

        public void SetWeekdayFlag(DayOfWeek dayOfWeek, bool enable)
        {
            if (this.WeekdayFlags.Length != 7)
                throw new Exception("WeekdayFlags Fromat Failure");

            var index = (int)dayOfWeek;
            var flagString = (enable) ? "1" : "0";

            var flags = this.WeekdayFlags;
            if (index == 0)
            {
                flags = flagString
                    + flags.Substring(index + 1);
            }
            else if (0 < index && index < 6)
            {
                flags = flags.Substring(0, index)
                    + flagString
                    + flags.Substring(index + 1);
            }
            else if (index == 6)
            {
                flags = flags.Substring(0, index)
                    + flagString;
            }
            else
            {
                throw new Exception("そんなばかなー");
            }

            this.WeekdayFlags = flags;
        }

        public Scene Scene { get; set; }
        public ControlSet ControlSet { get; set; }
        public Control Control { get; set; }
        public Job CurrentJob { get; set; }
    }
}
