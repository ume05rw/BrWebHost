using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BroadlinkWeb.Models.Entities
{
    [Table("controlsets")]
    public class ControlSet
    {
        [Key]
        [Column(Order = 0, TypeName = "int(11)")] // Orderプロパティは、EFCore未サポート
        [Description("Control-Set ID")] // Description属性は、EFCore未サポート
        public int Id { get; set; }

        [Required]
        [Column(Order = 1, TypeName = "varchar(50)")]
        [Description("Control-Set Label")]
        public string Label { get; set; }

        [Required]
        [Column(Order = 1, TypeName = "int(11)")]
        [Description("Taget Broadlink Device ID")]
        public int BrDeviceId { get; set; }


        public BrDevice BrDevice { get; set; }
    }
}
