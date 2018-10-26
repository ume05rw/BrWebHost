using MySql.Data.EntityFrameworkCore.DataAnnotations;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace BroadlinkWeb.Models.Entities
{
    [Table("brdevices")] // テーブル名を小文字指定しないとLinuxで動作しない。
    [MySqlCharset("utf8")]
    [MySqlCollation("utf8_general_ci ")]
    public class BrDevice
    {
        [Key]
        [Column(Order = 0, TypeName = "int(11)")] // Orderプロパティは、EFCore未サポート
        [Description("Registed Broadlink-device ID")] // Description属性は、EFCore未サポート
        public int Id { get; set; }

        [Required]
        [Column(Order = 1, TypeName = "varchar(20)")]
        [Description("MAC Address, Reversed")]
        public string MacAddressString { get; set; }

        [Required]
        [Column(Order = 2, TypeName = "varchar(20)")]
        [Description("IPv4 Address")]
        public string IpAddressString { get; set; }

        [Required]
        [Column(Order = 3, TypeName = "int(5)")]
        [Description("UDP Port")]
        public int Port { get; set; }

        [Required]
        [Column(Order = 4, TypeName = "int(6)")]
        [Description("Device-Type Detail")]
        public int DeviceTypeDetailNumber { get; set; }

        [NotMapped] // DBカラムとのマッピングを行わない。
        public bool IsActive => (this.SbDevice != null);

        [NotMapped] // DBカラムとのマッピングを行わない。
        public string DeviceTypeDetal => this.DeviceTypeDetailNumber.ToString("x2");

        [NotMapped] // DBカラムとのマッピングを行わない。
        public SharpBroadlink.Devices.DeviceType DeviceType => (this.SbDevice == null)
            ? SharpBroadlink.Devices.DeviceType.Unknown
            : this.SbDevice.DeviceType;

        [IgnoreDataMember] // JSONシリアライズ対象にしない。
        [NotMapped] // DBカラムとのマッピングを行わない。
        public SharpBroadlink.Devices.IDevice SbDevice { get; set; }
    }
}
