using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BroadlinkWeb.Models.Entities
{
    [NotMapped]
    public class Script
    {
        public int ControlId { get; set; }

        public string Name { get; set; }

        public int? RemoteHostId { get; set; }
    }
}
