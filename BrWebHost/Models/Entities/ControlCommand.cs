using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BrWebHost.Models.Entities
{
    [NotMapped]
    public class ControlCommand
    {
        public int ControlId { get; set; }
    }
}
