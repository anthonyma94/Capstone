using Capstone.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Capstone
{
    public static class Initialize
    {
        public static void InitializeData()
        {
            Store store = new Store
            {
                Id = new Guid(),
                Name = "Test Store"
            };

            Person person = new Person
            {
                Id = new Guid(),
                FirstName = "Jimmy",
                LastName = "Chu",
                Address = "123 Water Street",
            };
        }
    }
}