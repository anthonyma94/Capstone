using Capstone.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Capstone.Repositories
{
    public static class PersonRepository
    {
        private static ApplicationContext context;
        private static DbSet<Person> dbSet;
    }
}