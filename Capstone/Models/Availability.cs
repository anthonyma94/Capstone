using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Capstone.Models
{
    public class Availability : BaseEntity
    {
        [Required]
        public Person Person { get; set; }

        [Required]
        public bool IsApproved { get; set; }
    }

    public class AvailabilityLineItem : BaseEntity
    {
        [Required]
        public Availability Availability { get; set; }

        [Required]
        public DayLineItem Day { get; set; }
    }

    public class TimeOff : BaseEntity
    {
        [Required]
        public Person Person { get; set; }

        [Required]
        public string Reason { get; set; }

        [Required]
        public bool IsApproved { get; set; }
    }

    public class TimeOffLineItem : BaseEntity
    {
        [Required]
        public TimeOff TimeOff { get; set; }

        [Required]
        public DayLineItem DayLineItem { get; set; }
    }
}