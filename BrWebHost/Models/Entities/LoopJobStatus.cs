using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BrWebHost.Models.Entities
{
    [NotMapped]
    public class LoopJobStatus
    {
        public long Count { get; set; } = 0;
        public long ErrorCount { get; set; } = 0;
        public string StatusMessage { get; set; } = "";
        public string LatestError { get; set; } = "";
    }
}
