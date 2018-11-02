using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BroadlinkWeb.Models.Entities
{
    [NotMapped]
    public class LoopJobStatus
    {
        public int Count { get; set; } = 0;
        public int ErrorCount { get; set; } = 0;
        public string LatestError { get; set; } = "";
    }
}
