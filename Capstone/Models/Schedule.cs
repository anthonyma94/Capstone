using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Capstone.Models
{
    public class Schedule : BaseEntity
    {
        [Required]
        public bool IsDefault { get; set; }
    }

    public class ScheduleLineItem : BaseEntity
    {
        [Required]
        public Schedule Schedule { get; set; }

        [Required]
        public DayLineItem Day { get; set; }
    }

    public class ScheduleRule : BaseEntity
    {
        [Required]
        public DayLineItem Day { get; set; }
    }

    public class ScheduleRuleEmpLineItem : BaseEntity
    {
        [Required]
        public ScheduleRule ScheduleRule { get; set; }

        [Required]
        public JobTitle JobTitle { get; set; }

        [Required]
        public int Amount { get; set; }
    }

    public class PersonScheduleLineItem : BaseEntity
    {
        [Required]
        public Person Person { get; set; }

        [Required]
        public ScheduleLineItem Schedule { get; set; }
    }

    public class ShiftChange : BaseEntity
    {
        [Required]
        public PersonScheduleLineItem Schedule { get; set; }

        [Required]
        public Person NewPerson { get; set; }

        [Required]
        public bool IsEmployeeApproved { get; set; }

        [Required]
        public bool IsEmployerApproved { get; set; }
    }

    public class SickCall : BaseEntity
    {
        [Required]
        public PersonScheduleLineItem Schedule { get; set; }

        [Required]
        public bool IsApproved { get; set; }
    }
}