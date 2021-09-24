using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Capstone.Models
{
    public class Person : BaseEntity
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        public string Province { get; set; }

        [Required]
        public string Postal { get; set; }

        [Required]
        public JobTitle JobTitle { get; set; }

        [Required]
        public string Role { get; set; }

        [Required]
        public decimal Pay { get; set; }

        [Required]
        public string Phone { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }

        [Required]
        public int MaxWeeklyHours { get; set; }
    }

    public class JobTitle : BaseEntity
    {
        [Required]
        public string Name { get; set; }
    }
}