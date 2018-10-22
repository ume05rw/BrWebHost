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
    [Table("controlsets")] // テーブル名を小文字指定しないとLinuxで動作しない。
    [MySqlCharset("utf8")]
    [MySqlCollation("utf8_general_ci ")]
    public class ControlSet
    {
        [Key]
        [Column(Order = 0, TypeName = "int(11)")] // Orderプロパティは、EFCore未サポート
        [Description("Control-Set ID")] // Description属性は、EFCore未サポート
        public int Id { get; set; }

        [Column(Order = 1, TypeName = "varchar(50)")]
        [Description("Control-Set Name")]
        public string Name { get; set; }

        [Column(Order = 2, TypeName = "int(11)")]
        [Description("Taget Broadlink Device ID")]
        public int? BrDeviceId { get; set; }

        [Column(Order = 3, TypeName = "tinyint(1)")]
        [Description("Taget Broadlink Device ID")]
        public bool IsTemplate { get; set; }

        public List<Control> Controls { get; set; }
        public BrDevice BrDevice { get; set; }
    }
}
