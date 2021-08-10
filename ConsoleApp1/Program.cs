using Capstone;
using Capstone.Models;
using Capstone.Repositories;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Linq;

namespace ConsoleApp1
{
    internal class Program
    {
        private static void Main(string[] args)
        {
            DayLineItem[] days = JsonConvert.DeserializeObject<DayLineItem[]>(File.ReadAllText("./SampleStoreHours.json"));

            foreach (var item in days)
            {
                Console.WriteLine(item.Day);
                Console.WriteLine(item.Start);
            }
        }
    }
}