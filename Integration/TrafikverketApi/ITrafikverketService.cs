using System;
using System.Linq;
using TrafikverketdotNET.Subs.FerryRouteResponse;

namespace FerryTimetableApp.Integration.TrafikverketApi
{
    public interface ITrafikverketService
    {
        Timetable GetCurrentFerryRouteTimetable(string routeName, DateTime searchDate);

        IOrderedEnumerable<string> GetFerryRouteNames();
    }
}