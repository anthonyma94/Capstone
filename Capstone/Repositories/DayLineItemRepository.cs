using Capstone.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Capstone.Repositories
{
    public class DayLineItemRepository : BaseRepository<DayLineItem>
    {
        public DayLineItemRepository(ApplicationContext context) : base(context)
        {
        }

        /// <summary>
        /// Returns an existing DayLineItem if an identical one exists.
        /// </summary>
        /// <param name="entity">new item to add</param>
        /// <returns>daylineitem</returns>
        public async override Task<DayLineItem> Add(DayLineItem entity)
        {
            var existingItem = context.DayLineItems.FirstOrDefault(x => x.Day == entity.Day && x.Date == entity.Date && x.Start == entity.Start && x.End == entity.End);

            if (existingItem != null)
            {
                return existingItem;
            }
            else
            {
                return await base.Add(entity);
            }
        }
    }
}