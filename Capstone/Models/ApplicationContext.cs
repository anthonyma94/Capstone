using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.IO;
using System.Linq;

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

            // Job Title
            JobTitle[] titles = new JobTitle[]
            {
                new JobTitle
                {
                    Name = "Stock"
                },
                new JobTitle
                {
                    Name = "Sales"
                },
                new JobTitle
                {
                    Name = "Cashier"
                },
                new JobTitle
                {
                    Name = "Manager"
                },
            };
            modelBuilder.Entity<JobTitle>().HasData(titles);

            // Person
            Person[] persons = JsonConvert.DeserializeObject<Person[]>(File.ReadAllText("./Models/Samples/SamplePeople.json"));

            int maxPeople = persons.Length;
            int maxSales = (int)(maxPeople * 0.5);
            int maxStock = (int)(maxPeople * 0.2);
            int maxCash = (int)(maxPeople * 0.2);
            int maxManager = (int)(maxPeople * 0.1);

            for (int i = 0; i < persons.Length; i++)
            {
                var person = persons[i];
                if (maxSales > 0)
                {
                    person.JobTitle = titles.First(x => x.Name == "Sales");
                    maxSales--;
                }
                else if (maxStock > 0)
                {
                    person.JobTitle = titles.First(x => x.Name == "Stock");
                    maxStock--;
                }
                else if (maxCash > 0)
                {
                    person.JobTitle = titles.First(x => x.Name == "Cashier");
                    maxCash--;
                }
                else
                {
                    person.JobTitle = titles.First(x => x.Name == "Manager");
                    maxManager--;
                }
                persons[i] = person;
            }

            modelBuilder.Entity<Person>().HasData(persons.Select(x => new
            {
                Id = x.Id,
                FirstName = x.FirstName,
                LastName = x.LastName,
                Address = x.Address,
                Province = x.Province,
                Postal = x.Postal,
                Role = x.Role,
                Pay = x.Pay,
                Phone = x.Phone,
                Username = x.Username,
                Password = x.Password,
                MaxWeeklyHours = x.MaxWeeklyHours,
                JobTitleId = x.JobTitle.Id
            }));
        }
    }
}