using System.Collections.Generic;
using TrafikverketdotNET;

namespace FerryTimetableApp.Integration.TrafikverketApi
{
    /// <summary>
    /// "Caching" 😜
    /// </summary>
    public class CachingTrafikverketClient : ITrafikverketClient
    {
        private readonly Dictionary<string, FerryRouteResponse> _cache;

        private FerryRouteResponse _routeNameCache = null;

        private readonly TrafikverketClient _client;

        public CachingTrafikverketClient(TrafikverketClient client)
        {
            _cache = new Dictionary<string, FerryRouteResponse>();
            _client = client;
        }

        public FerryRouteResponse GetFerryRouteData(string routeName)
        {
            if (_cache.TryGetValue(routeName, out var cachedValue))
            {
                return cachedValue;
            }

            var response = _client.GetFerryRouteData(routeName);

            _cache.Remove(routeName);
            _cache.Add(routeName, response);

            return response;
        }

        public FerryRouteResponse GetFerryRouteNames()
        {
            return _routeNameCache ??= _client.GetFerryRouteNames();
        }
    }
}