using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;


namespace BroadlinkWeb.Models.Entities
{
    [NotMapped]
    public class DateTimeRange
    {
        public string Start { get; set; }
        public string End { get; set; }

        public DateTime StartDateTime
        {
            get
            {
                DateTime result;
                if (DateTime.TryParse(this.Start, out result))
                    return result;
                else
                    return DateTime.MinValue;
            }
        }

        public DateTime EndDateTime
        {
            get
            {
                DateTime result;
                if (DateTime.TryParse(this.End, out result))
                    return result;
                else
                    return DateTime.MaxValue;
            }
        }
    }
}
