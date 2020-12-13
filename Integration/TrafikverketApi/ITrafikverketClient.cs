using TrafikverketdotNET;

namespace FerryTimetableApp.Integration.TrafikverketApi
{
    public interface ITrafikverketClient
    {
        FerryRouteResponse GetFerryRouteData(string routeName);

        FerryRouteResponse GetFerryRouteNames();
    }
}