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
    [Table("remotescripts")] // テーブル名を小文字指定しないとLinuxで動作しない。
    [MySqlCharset("utf8")]
    [MySqlCollation("utf8_general_ci ")]
    public class RemoteScript
    {
        [Key]
        [Column(Order = 0, TypeName = "int(11)")] // Orderプロパティは、EFCore未サポート
        [Description("Remote Script ID")] // Description属性は、EFCore未サポート
        public int Id { get; set; }

        [Column(Order = 1, TypeName = "int(11)")]
        [Description("Remote Host ID")]
        public int RemoteHostId { get; set; }

        [Column(Order = 2, TypeName = "int(11)")]
        [Description("Remote Host Control ID")]
        public int ControlId { get; set; }

        [Column(Order = 3, TypeName = "varchar(255)")]
        [Description("Remote Script Name")]
        [StringLength(255)]
        public string Name { get; set; }

        public RemoteHost RemoteHost { get; set; }
    }
}
