using System;
using Microsoft.Extensions.Caching.Memory;
using TrafikverketdotNET;

namespace FerryTimetableApp.Integration.TrafikverketApi
{
    public class CachingTrafikverketClient : ITrafikverketClient
    {
        private const string RouteNameCacheKey = "__ROUTE_NAMES__";

        private readonly TrafikverketClient _client;

        private readonly IMemoryCache _memoryCache;

        public CachingTrafikverketClient(TrafikverketClient client, IMemoryCache memoryCache)
        {
            _client = client;
            _memoryCache = memoryCache;
        }

        public FerryRouteResponse GetFerryRouteData(string routeName)
        {
            return _memoryCache.GetOrCreate(routeName, entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);
                return _client.GetFerryRouteData(routeName);
            });
        }

        public FerryRouteResponse GetFerryRouteNames()
        {
            return _memoryCache.GetOrCreate(RouteNameCacheKey, entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1);
                return _client.GetFerryRouteNames();
            });
        }
    }
}