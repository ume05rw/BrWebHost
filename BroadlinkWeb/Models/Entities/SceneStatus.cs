using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BroadlinkWeb.Models.Entities
{
    [NotMapped]
    public class SceneStatus
    {
        public int Step { get; set; } = 1;
        public int TotalStep { get; set; } = 1;
        public string Error { get; set; } = "";
    }
}
