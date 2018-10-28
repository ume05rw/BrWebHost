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
        public double Temperature { get; set; }

        public double Humidity { get; set; }

        public int Voc { get; set; }

        public int Light { get; set; }

        public int Noise { get; set; }
    }
}
