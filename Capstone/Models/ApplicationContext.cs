using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Capstone.Models
{
    public class ApplicationContext : DbContext
    {
        public DbSet<Store> Stores { get; set; }
        public DbSet<StoreHour> StoreHours { get; set; }
        public DbSet<StoreHourLineItem> StoreHourLineItems { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<Person> Person { get; set; }
        public DbSet<ShiftChange> ShiftChanges { get; set; }
        public DbSet<JobTitle> JobTitles { get; set; }
        public DbSet<Availability> Availabilities { get; set; }
        public DbSet<TimeOff> TimeOffs { get; set; }
        public DbSet<PersonScheduleLineItem> PersonScheduleLineItems { get; set; }
        public DbSet<ScheduleRuleEmpLineItem> ScheduleRuleEmpLineItems { get; set; }
        public DbSet<AvailabilityLineItem> AvailabilityLineItems { get; set; }
        public DbSet<TimeOffLineItem> TimeOffLineItems { get; set; }
        public DbSet<SickCall> SickCalls { get; set; }
        public DbSet<ScheduleLineItem> ScheduleLineItems { get; set; }
        public DbSet<ScheduleRule> ScheduleRules { get; set; }
        public DbSet<DayLineItem> DayLineItems { get; set; }

        public ApplicationContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Schedule>().Property(x => x.IsDefault).HasDefaultValue(false);
        }
    }
}