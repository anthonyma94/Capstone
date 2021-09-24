using Capstone.Models;
using Microsoft.EntityFrameworkCore;
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

        public async override Task<List<Store>> GetAll()
        {
            var res = await context.Stores.Include(x => x.StoreHours).ThenInclude(y => y.Day).ToListAsync();
            return res;
        }

        public async override Task<Store> Get(Guid id)
        {
            var res = await GetAll();
            return res.FirstOrDefault(x => x.Id == id);
        }

        public async Task<StoreHourLineItem> AddStoreHourLineItem(StoreHourLineItem item)
        {
            context.StoreHourLineItems.Add(item);
            await context.SaveChangesAsync();
            return item;
        }
    }
}