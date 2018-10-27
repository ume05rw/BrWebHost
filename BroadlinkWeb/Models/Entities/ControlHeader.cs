using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BroadlinkWeb.Models.Entities
{
    [NotMapped]
    public class ControlHeader
    {
        [NotMapped]
        public int Id { get; set; }

        [NotMapped]
        public int Order { get; set; }

        [NotMapped]
        public bool ToggleState { get; set; }
    }
}
