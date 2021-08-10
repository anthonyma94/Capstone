using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Capstone.Models;
using Capstone.Repositories;
using Newtonsoft.Json.Linq;
using static Capstone.Models.DayLineItem;

namespace Capstone.Controllers
{
    [Route("api/store")]
    [ApiController]
    public class StoresController : BaseController<Store, StoreRepository>
    {
        private readonly DayLineItemRepository dayLineItemRepo;

        public StoresController(StoreRepository repo, DayLineItemRepository dayLine) : base(repo)
        {
            dayLineItemRepo = dayLine;
        }

        [HttpPut("{id}")]
        [Route("[action]/{id}")]
        public async Task<ActionResult<Store>> ChangeName(Guid id, [FromBody] JObject obj)
        {
            var store = await repo.Get(id);
            string name = obj.Value<string>("name");

            if (store == null)
            {
                return BadRequest();
            }

            store.Name = name;
            return await repo.Update(store);
        }

        [HttpPut("{id}")]
        [Route("[action]/{id}")]
        public async Task<ActionResult<Store>> ChangeHours(Guid id, JArray body)
        {
            var store = await repo.Get(id);
            bool updated = false;
            if (store == null)
            {
                return BadRequest();
            }

            for (int i = 0; i < body.Count; i++)
            {
                var item = body[i];
                var start = item["start"].ToString();
                var end = item["end"].ToString();
                if (item["id"] == null) // New item
                {
                    if (!string.IsNullOrEmpty(start) && !string.IsNullOrEmpty(end))
                    {
                        var newDay = await dayLineItemRepo.Add(new DayLineItem
                        {
                            Day = (DayNames)i,
                            Start = TimeSpan.Parse(start),
                            End = TimeSpan.Parse(end)
                        });
                        var newStoreHour = await
                        repo.AddStoreHourLineItem(new StoreHourLineItem
                        {
                            Day = newDay,
                            Store = store
                        });
                    }
                }
                else // Update item
                {
                    updated = true;
                    //var day = await dayLineItemRepo.Get(Guid.Parse(item["id"].ToString()));
                    var storeHour = store.StoreHours.Find(x => x.Day.Id == Guid.Parse(item["id"].ToString()));
                    var day = storeHour.Day;
                    if (string.IsNullOrEmpty(start) || string.IsNullOrEmpty(end))
                    {
                        store.StoreHours.Remove(storeHour);
                    }
                    else
                    {
                        day.Start = TimeSpan.Parse(start);
                        day.End = TimeSpan.Parse(end);
                    }
                }
            }

            if (updated)
                return await repo.Update(store);
            else return store;
        }
    }
}