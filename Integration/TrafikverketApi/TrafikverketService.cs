using System;
using System.Linq;
using FerryTimetableApp.Helpers;
using TrafikverketdotNET.Subs.FerryRouteResponse;

namespace FerryTimetableApp.Integration.TrafikverketApi
{
    public class TrafikverketService : ITrafikverketService
    {
        private readonly ITrafikverketClient _trafikverketClient;

        public TrafikverketService(ITrafikverketClient trafikverketClient)
        {
            _trafikverketClient = trafikverketClient;
        }

        public Timetable GetCurrentFerryRouteTimetable(string routeName, DateTime searchDate)
        {
            var response = _trafikverketClient.GetFerryRouteData(routeName);

            var ferryRouteData = response?.Data.SingleOrDefault();

            return ferryRouteData
                ?.Timetable
                .Where(timetable => timetable.Valid
                    .Any(validity => validity
                        .Contains(searchDate)
                    )
                )
                .OrderByDescending(timetable => timetable.Priority)
                .FirstOrDefault();
        }

        public IOrderedEnumerable<string> GetFerryRouteNames()
        {
            var response = _trafikverketClient.GetFerryRouteNames();

            var ferryRouteDatas = response.Data;

            return ferryRouteDatas?.Any() == true
                ? ferryRouteDatas
                    .Select(route => route.Name)
                    .OrderBy(_ => _)
                : null;
        }
    }
}