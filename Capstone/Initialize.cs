using Capstone.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Capstone
{
    public static class Initialize
    {
        public static void InitializeData()
        {
            Person[] persons = JsonConvert.DeserializeObject<Person[]>(File.ReadAllText("./Models/Samples/SamplePeople.json"));
            Console.WriteLine(persons.Length);
        }
    }
}