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
    public class JobTitleController : BaseController<JobTitle, JobTitleRepository>
    {
        public JobTitleController(JobTitleRepository repo) : base(repo)
        {
        }
    }
}