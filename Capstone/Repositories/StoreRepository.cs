using Capstone.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Capstone.Repositories
{
    public class StoreRepository : BaseRepository<Store>
    {
        public StoreRepository(ApplicationContext context) : base(context)
        {
        }
    }
}