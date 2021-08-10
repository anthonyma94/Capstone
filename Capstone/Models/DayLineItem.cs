using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Capstone.Models
{
    public class DayLineItem : BaseEntity
    {
        public enum DayNames
        {
            SUNDAY = 0,
            MONDAY = 1,
            TUESDAY = 2,
            WEDNESDAY = 3,
            THURSDAY = 4,
            FRIDAY = 5,
            SATURDAY = 6
        }

        public DayNames? Day { get; set; }

        [DataType(DataType.Date)]
        [Column(TypeName = "Date")]
        public DateTime? Date { get; set; }

        [Required, DataType(DataType.Time)]
        public TimeSpan Start { get; set; }

        [Required, DataType(DataType.Time)]
        public TimeSpan End { get; set; }
    }
}