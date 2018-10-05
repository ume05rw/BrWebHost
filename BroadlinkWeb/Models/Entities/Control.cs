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
        [Description("Label")]
        public string Label { get; set; }

        [Required]
        [Column(Order = 3, TypeName = "int(11)")]
        [Description("Position X px")]
        public string PositionX { get; set; }

        [Required]
        [Column(Order = 4, TypeName = "int(11)")]
        [Description("Position Y px")]
        public string PositionY { get; set; }

        [Required]
        [Column(Order = 5, TypeName = "int(11)")]
        [Description("Size px")]
        public string Size { get; set; }

        [Required]
        [Column(Order = 6, TypeName = "varchar(8)")]
        [Description("Color Hex")]
        public string Color { get; set; }

        [Column(Order = 7, TypeName = "int(11)")]
        [Description("Icon ID")]
        public string IconId { get; set; }

        [Column(Order = 7, TypeName = "text")]
        [Description("IR Code Byte String")]
        public string Code { get; set; }

        public ControlSet ControlSet { get; set; }

        public Icon Icon { get; set; }
    }
}
