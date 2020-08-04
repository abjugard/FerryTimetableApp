using System;
using System.Linq;
using System.Threading.Tasks;
using FerryTimetableApp.Model;

namespace FerryTimetableApp.Integration.Trafikverket
{
    public interface ITrafikverketService
    {
        Task<FerryRouteTimetable> GetCurrentFerryRouteTimetable(string routeName, DateTime searchDate);

        Task<IOrderedEnumerable<string>> GetFerryRouteNames();
    }
}