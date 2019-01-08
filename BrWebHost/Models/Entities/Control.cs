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
    [Table("controls")] // テーブル名を小文字指定しないとLinuxで動作しない。
    //[MySqlCharset("utf8")]
    //[MySqlCollation("utf8_general_ci ")]
    public class Control
    {
        [Key]
        //[Column(Order = 0, TypeName = "int(11)")] // Orderプロパティは、EFCore未サポート
        [Description("Control ID")] // Description属性は、EFCore未サポート
        public int Id { get; set; }

        [Required]
        //[Column(Order = 1, TypeName = "int(11)")]
        [Description("Control Set ID")]
        public int ControlSetId { get; set; }

        //[Required] //<- 空でもOK
        //[Column(Order = 2, TypeName = "varchar(50)")]
        [Description("Name")]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        //[Column(Order = 3, TypeName = "int(11)")]
        [Description("Position Left px")]
        public int PositionLeft { get; set; }

        [Required]
        //[Column(Order = 4, TypeName = "int(11)")]
        [Description("Position Top px")]
        public int PositionTop { get; set; }

        [Required]
        //[Column(Order = 5, TypeName = "varchar(255)")]
        [Description("Color String")]
        [StringLength(255)]
        public string Color { get; set; }

        //[Column(Order = 6, TypeName = "varchar(255)")]
        [Description("Icon Url")]
        [StringLength(255)]
        public string IconUrl { get; set; }

        //[Column(Order = 7, TypeName = "text")]
        [Description("IR Code Byte String")]
        [StringLength(1000)]
        public string Code { get; set; }

        //[Column(Order = 8, TypeName = "tinyint(1)")]
        [Description("Toggle assign On")]
        public bool IsAssignToggleOn { get; set; }

        //[Column(Order = 9, TypeName = "tinyint(1)")]
        [Description("Toggle assign Off")]
        public bool IsAssignToggleOff { get; set; }


        public ControlSet ControlSet { get; set; }
    }
}
