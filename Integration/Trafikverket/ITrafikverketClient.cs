using System.Linq;
using System.Threading.Tasks;
using FerryTimetableApp.Model;

namespace FerryTimetableApp.Integration.Trafikverket
{
    public interface ITrafikverketClient
    {
        Task<TrafikverketApiResponse<FerryRouteApiResponse>> GetFerryRouteData(string routeName);

        Task<TrafikverketApiResponse<FerryRouteApiResponse>> GetFerryRouteNames();
    }
}