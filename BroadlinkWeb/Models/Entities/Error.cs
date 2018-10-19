using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BroadlinkWeb.Models.Entities
{
    [NotMapped]
    public class Error
    {
        [NotMapped]
        public string Name { get; set; }

        [NotMapped]
        public string Message { get; set; }
    }
}
