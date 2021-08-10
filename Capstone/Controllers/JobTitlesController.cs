using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Capstone.Models;
using Capstone.Repositories;

namespace Capstone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobTitlesController : BaseController<JobTitle, JobTitleRepository>
    {
        public JobTitlesController(JobTitleRepository repo) : base(repo)
        {
        }

        //[HttpPost]
        //public async Task<ActionResult<JobTitle>> Create(string job)
        //{
        //    var res = await repo.GetAll();
        //    if (res.Exists(x => x.Name.ToLower() == job.ToLower().Trim()))
        //    {
        //        return BadRequest();
        //    }

        //    return await base.Create(new JobTitle
        //    {
        //        Name = job
        //    });
        //}
    }
}