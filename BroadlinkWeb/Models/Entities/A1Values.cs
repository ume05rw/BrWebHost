using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BroadlinkWeb.Models.Entities
{
    [NotMapped]
    public class A1Values
    {
        [NotMapped]
        public double Temperature { get; set; }

        [NotMapped]
        public double Humidity { get; set; }

        [NotMapped]
        public int Voc { get; set; }

        [NotMapped]
        public int Light { get; set; }

        [NotMapped]
        public int Noise { get; set; }
    }
}
