using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BroadlinkWeb.Models.Entities
{
    [NotMapped]
    public class Sp2Status
    {
        [NotMapped]
        public bool Power { get; set; }

        [NotMapped]
        public bool NightLight { get; set; }
    }
}
