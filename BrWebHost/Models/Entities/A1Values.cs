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
    [Table("a1sensors")] // テーブル名を小文字指定しないとLinuxで動作しない。
    //[MySqlCharset("utf8")]
    //[MySqlCollation("utf8_general_ci ")]
    public class A1Values
    {
        [Key]
        //[Column(Order = 0, TypeName = "int(11)")] // Orderプロパティは、EFCore未サポート
        [Description("Sensor Value ID")] // Description属性は、EFCore未サポート
        public int Id { get; set; }

        //[Column(Order = 2, TypeName = "int(11)")]
        [Description("Broadlink Device ID")]
        public int? BrDeviceId { get; set; }

        //[Column(Order = 3, TypeName = "decimal(5, 2)")]
        [Description("Temperature Celsius")]
        [Range(-999.99, 999.991)]
        public decimal Temperature { get; set; }

        //[Column(Order = 4, TypeName = "decimal(5, 2)")]
        [Description("Humidity")]
        [Range(0.0, 100.00)]
        public decimal Humidity { get; set; }

        //[Column(Order = 5, TypeName = "decimal(5, 2)")]
        [Description("Voc")]
        [Range(0.0, 3.00)]
        public decimal Voc { get; set; }

        //[Column(Order = 6, TypeName = "decimal(5, 2)")]
        [Description("Light")]
        [Range(0.0, 3.00)]
        public decimal Light { get; set; }

        //[Column(Order = 7, TypeName = "decimal(5, 2)")]
        [Description("Noise")]
        [Range(0.0, 2.00)]
        public decimal Noise { get; set; }

        //[Column(Order = 8, TypeName = "int(5)")]
        [Description("Data Acquired Count")]
        public int AcquiredCount { get; set; }

        [Required]
        //[Column(Order = 9, TypeName = "datetime")]
        [Description("Record Time")]
        [DataType(DataType.DateTime)]
        public DateTime Recorded { get; set; }

        [Required]
        //[Column(Order = 10, TypeName = "datetime")]
        [Description("Created Time")]
        [DataType(DataType.DateTime)]
        public DateTime Created { get; set; }

        //[Column(Order = 11, TypeName = "datetime")]
        [Description("Updated Time")]
        [DataType(DataType.DateTime)]
        public DateTime? Updated { get; set; }
    }
}
