using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BrWebHost.Models.Entities
{
    [NotMapped]
    public class RmCommand
    {
        public string Code { get; set; }
    }
}
