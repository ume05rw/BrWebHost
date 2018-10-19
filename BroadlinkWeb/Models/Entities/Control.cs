using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BroadlinkWeb.Models.Entities
{
    [Table("controls")] // テーブル名を小文字指定しないとLinuxで動作しない。
    public class Control
    {
        [Key]
        [Column(Order = 0, TypeName = "int(11)")] // Orderプロパティは、EFCore未サポート
        [Description("Control ID")] // Description属性は、EFCore未サポート
        public int Id { get; set; }

        [Required]
        [Column(Order = 1, TypeName = "int(11)")]
        [Description("Control Set ID")]
        public int ControlSetId { get; set; }

        [Required]
        [Column(Order = 2, TypeName = "varchar(50)")]
        [Description("Name")]
        public string Name { get; set; }

        [Required]
        [Column(Order = 3, TypeName = "int(11)")]
        [Description("Position Left px")]
        public string PositionLeft { get; set; }

        [Required]
        [Column(Order = 4, TypeName = "int(11)")]
        [Description("Position Top px")]
        public string PositionTop { get; set; }

        [Required]
        [Column(Order = 5, TypeName = "varchar(8)")]
        [Description("Color String")]
        public string Color { get; set; }

        [Required]
        [Column(Order = 6, TypeName = "varchar(8)")]
        [Description("HoverColor String")]
        public string HoverColor { get; set; }

        [Column(Order = 7, TypeName = "int(11)")]
        [Description("Icon Url")]
        public string IconUrl { get; set; }

        [Column(Order = 8, TypeName = "text")]
        [Description("IR Code Byte String")]
        public string Code { get; set; }

        [Column(Order = 9, TypeName = "tinyint(1)")]
        [Description("Toggle assign On")]
        public bool IsAssignToggleOn { get; set; }

        [Column(Order = 10, TypeName = "tinyint(1)")]
        [Description("Toggle assign Off")]
        public bool IsAssignToggleOff { get; set; }


        public ControlSet ControlSet { get; set; }
    }
}
