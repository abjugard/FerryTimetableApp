using System;
using System.Linq;
using System.Threading.Tasks;
using FerryTimetableApp.Model;
using FerryTimetableApp.Helpers;

namespace FerryTimetableApp.Integration.Trafikverket
{
    public class TrafikverketService : ITrafikverketService
    {
        private readonly ITrafikverketClient _trafikverketClient;

        public TrafikverketService(ITrafikverketClient trafikverketClient)
        {
            _trafikverketClient = trafikverketClient;
        }

        public async Task<FerryRouteTimetable> GetCurrentFerryRouteTimetable(string routeName, DateTime searchDate)
        {
            var deserializedResponse = await _trafikverketClient.GetFerryRouteData(routeName);

            var ferryRouteApiResponse = deserializedResponse
                .RESPONSE
                .RESULT
                .SingleOrDefault();

            var ferryRoute = ferryRouteApiResponse?.FerryRoute.SingleOrDefault();

            return ferryRoute
                ?.Timetable
                .Where(timetable => timetable.Valid
                    .Any(validity => validity
                        .Contains(searchDate)
                    )
                )
                .OrderByDescending(timetable => timetable.Priority)
                .FirstOrDefault();
        }

        public async Task<IOrderedEnumerable<string>> GetFerryRouteNames()
        {
            var result = await _trafikverketClient.GetFerryRouteNames();

            return result.OrderBy(_ => _);
        }
    }
}