using Capstone.Models;
using Capstone.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Capstone.Controllers
{
    public abstract class BaseController<TEntity, TRepository> : ControllerBase
        where TEntity : BaseEntity
        where TRepository : BaseRepository<TEntity>
    {
        protected readonly TRepository repo;

        protected BaseController(TRepository repo)
        {
            this.repo = repo;
        }

        // GET: api/[controller]
        [HttpGet]
        public virtual async Task<ActionResult<IEnumerable<TEntity>>> Get()
        {
            return await repo.GetAll();
        }

        // GET: api/[controller]/5
        [HttpGet("{id}")]
        public virtual async Task<ActionResult<TEntity>> Get(Guid id)
        {
            var item = await repo.Get(id);
            if (item == null)
            {
                return NotFound();
            }
            return item;
        }

        // PUT: api/[controller]/5
        [HttpPut("{id}")]
        public virtual async Task<ActionResult<TEntity>> Update(Guid id, TEntity item)
        {
            if (id != item.Id)
            {
                return BadRequest();
            }
            var newItem = await repo.Update(item);
            return newItem;
        }

        // POST: api/[controller]
        [HttpPost]
        public virtual async Task<ActionResult<TEntity>> Create(TEntity item)
        {
            await repo.Add(item);
            return CreatedAtAction("Get", new { id = item.Id }, item);
        }

        // DELETE: api/[controller]/5
        [HttpDelete("{id}")]
        public virtual async Task<ActionResult<TEntity>> Delete(Guid id)
        {
            var item = await repo.Delete(id);
            if (item == null)
            {
                return NotFound();
            }
            return item;
        }
    }
}