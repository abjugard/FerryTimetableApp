using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FerryTimetableApp.Model;

namespace FerryTimetableApp.Integration.Trafikverket
{
    /// <summary>
    /// "Caching" 😜
    /// </summary>
    public class CachingTrafikverketClient : ITrafikverketClient
    {
        private readonly Dictionary<string, TrafikverketApiResponse<FerryRouteApiResponse>> _cache;

        private IOrderedEnumerable<string> _routeNameCache = null;

        private readonly TrafikverketClient _client;

        public CachingTrafikverketClient(TrafikverketClient client)
        {
            _cache = new Dictionary<string, TrafikverketApiResponse<FerryRouteApiResponse>>();
            _client = client;
        }

        public async Task<TrafikverketApiResponse<FerryRouteApiResponse>> GetFerryRouteData(string routeName)
        {
            if (_cache.TryGetValue(routeName, out var cachedValue))
            {
                return cachedValue;
            }

            var response = await _client.GetFerryRouteData(routeName);

            _cache.Remove(routeName);
            _cache.Add(routeName, response);

            return response;
        }

        public async Task<IOrderedEnumerable<string>> GetFerryRouteNames()
        {
            return _routeNameCache ??= await _client.GetFerryRouteNames();
        }
    }
}