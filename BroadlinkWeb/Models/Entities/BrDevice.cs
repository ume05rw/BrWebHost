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
        [Column(TypeName = "varchar(256)")]
        public string IpAddressString { get; set; }

        [Required]
        [Column(TypeName = "varchar(50)")]
        public string BrDeviceType { get; set; }

        [IgnoreDataMember]
        [NotMapped]
        public SharpBroadlink.Devices.IDevice SbDevice { get; set; }
    }
}
