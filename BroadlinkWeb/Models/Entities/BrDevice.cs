using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace BroadlinkWeb.Models.Entities
{
    public class BrDevice
    {
        [Key]
        [Column(TypeName = "int(11)")]
        public int Id { get; set; }

        [Required]
        [Column(TypeName = "varchar(20)")]
        public string MacAddressString { get; set; }

        [Required]
        [Column(TypeName = "varchar(20)")]
        public string IpAddressString { get; set; }

        [Required]
        [Column(TypeName = "int(5)")]
        public int Port { get; set; }

        [Required]
        [Column(TypeName = "int(6)")]
        public int DeviceTypeNumber { get; set; }

        [Required]
        [Column(TypeName = "tinyint(1)")]
        public bool IsActive { get; set; }

        //[IgnoreDataMember] // JSONシリアライズ対象にしない。
        //[NotMapped] // DBカラムとのマッピングを行わない。
        //public SharpBroadlink.Devices.IDevice SbDevice { get; set; }
    }
}
