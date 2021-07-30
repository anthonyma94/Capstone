using Capstone.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Capstone.Repositories
{
    public class PersonRepository : BaseRepository<Person>
    {
        public PersonRepository(ApplicationContext context) : base(context)
        {
        }

        public override async Task<List<Person>> GetAll()
        {
            return await context.Person.Include(x => x.JobTitle).ToListAsync();
        }
    }
}