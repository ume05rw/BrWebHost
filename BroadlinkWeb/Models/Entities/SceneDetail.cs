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
    [Table("scenedetails")] // テーブル名を小文字指定しないとLinuxで動作しない。
    [MySqlCharset("utf8")]
    [MySqlCollation("utf8_general_ci ")]
    public class SceneDetail
    {
        [Key]
        [Column(Order = 0, TypeName = "int(11)")] // Orderプロパティは、EFCore未サポート
        [Description("Scene Detail ID")] // Description属性は、EFCore未サポート
        public int Id { get; set; }

        [Required]
        [Column(Order = 0, TypeName = "int(11)")]
        [Description("Scene ID")]
        public int SceneId { get; set; }

        [Required]
        [Column(Order = 0, TypeName = "int(11)")] 
        [Description("ControlSet ID")]
        public int ControlSetId { get; set; }

        [Required]
        [Column(Order = 0, TypeName = "int(11)")]
        [Description("Control ID")]
        public int ControlId { get; set; }

        [Required]
        [Column(Order = 0, TypeName = "decimal(6, 1)")]
        [Description("Control ID")]
        public decimal WaitSecond { get; set; }

        [Required]
        [Column(Order = 5, TypeName = "int(11)")]
        [Description("Position Order")]
        public int Order { get; set; }

        public Scene Scene { get; set; }
        public ControlSet ControlSet { get; set; }
        public Control Control { get; set; }
    }
}
