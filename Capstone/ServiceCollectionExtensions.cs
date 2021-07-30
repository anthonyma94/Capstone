using Capstone.Repositories;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace Capstone
{
    public static class ServiceCollectionExtensions
    {
        public static void RegisterAllRepos(this IServiceCollection services, Assembly[] assemblies)
        {
            var typesFromAssemblies = assemblies.SelectMany(a => a.DefinedTypes.Where(x => IsSubclassOfRawGeneric(typeof(BaseRepository<>), x)
            ));
            foreach (var type in typesFromAssemblies)
                services.AddTransient(type);
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