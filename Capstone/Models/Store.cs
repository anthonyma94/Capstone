using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Capstone.Models
{
    public class Store : BaseEntity
    {
        [Required]
        public string Name { get; set; }
    }

    public class StoreHour : BaseEntity
    {
        [Required]
        public Store Store { get; set; }
    }

    public class StoreHourLineItem : BaseEntity
    {
        [Required]
        public StoreHour StoreHour { get; set; }

        [Required]
        public DayLineItem Day { get; set; }
    }
}