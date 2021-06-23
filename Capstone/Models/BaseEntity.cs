using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Capstone.Models
{
    public abstract class BaseEntity
    {
        public Guid Id { get; set; } = new Guid();
    }
}