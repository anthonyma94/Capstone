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
            var typesFromAssemblies = (new[] { typeof(Startup).Assembly }).SelectMany(x => x.DefinedTypes.Where(y => IsSubclassOfRawGeneric(typeof(BaseRepository<>), y)));
            foreach (var item in typesFromAssemblies)
            {
                Console.WriteLine(item.Name);
            }
        }

        private static bool IsSubclassOfRawGeneric(Type generic, Type toCheck)
        {
            while (toCheck != null && toCheck != typeof(object) && generic != toCheck)
            {
                var cur = toCheck.IsGenericType ? toCheck.GetGenericTypeDefinition() : toCheck;
                if (generic == cur)
                {
                    return true;
                }
                toCheck = toCheck.BaseType;
            }
            return false;
        }
    }
}