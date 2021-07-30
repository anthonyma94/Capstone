using Capstone.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Capstone.Repositories
{
    public class JobTitleRepository : BaseRepository<JobTitle>
    {
        public JobTitleRepository(ApplicationContext context) : base(context)
        {
        }
    }
}