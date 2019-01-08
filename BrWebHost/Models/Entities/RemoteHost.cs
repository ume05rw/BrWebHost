using MySql.Data.EntityFrameworkCore.DataAnnotations;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BrWebHost.Models.Entities
{
    [Table("remotehosts")] // テーブル名を小文字指定しないとLinuxで動作しない。
    //[MySqlCharset("utf8")]
    //[MySqlCollation("utf8_general_ci ")]
    public class RemoteHost
    {
        [Key]
        //[Column(Order = 0, TypeName = "int(11)")] // Orderプロパティは、EFCore未サポート
        [Description("Control-Set ID")] // Description属性は、EFCore未サポート
        public int Id { get; set; }

        //[Column(Order = 1, TypeName = "varchar(50)")]
        [Description("Remote Host Name")]
        [StringLength(50)]
        public string Name { get; set; }

        //[Column(Order = 2, TypeName = "varchar(255)")]
        [Description("IP Address String")]
        [StringLength(255)]
        public string IpAddressString { get; set; }
    }
}
