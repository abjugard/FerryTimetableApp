using System.Linq;
using FerryTimetableApp.Model;
using Microsoft.Extensions.Options;
using TrafikverketdotNET;

namespace FerryTimetableApp.Integration.TrafikverketApi
{
    public class TrafikverketClient : ITrafikverketClient
    {
        private readonly IOptions<AppConfiguration> _config;

        private TrafikverketIntegrationConfigSection IntegrationConfig => _config.Value.TrafikverketIntegration;

        private string ApiKey => IntegrationConfig.ApiKey;

        private readonly Trafikverket _api;

        public TrafikverketClient(IOptions<AppConfiguration> config)
        {
            _config = config;
            _api = new Trafikverket(ApiKey);
        }

        public FerryRouteResponse GetFerryRouteData(string routeName)
        {
            var filter = new Filter();
            filter.AddOperator(new FilterOperator(FilterOperatorType.EQ, "Name", routeName));

            var query = new Query(ObjectType.FerryRoute, Trafikverket.SchemaVersions[ObjectType.FerryRoute]);
            query.SetFilter(filter);
            query.SetInclude("Timetable");
            query.SetLimit(2);

            var response = _api.ExecuteRequest(new TrafikverketRequest(query));
            return response.FerryRouteResponse.SingleOrDefault();
        }

        public FerryRouteResponse GetFerryRouteNames()
        {
            var query = new Query(ObjectType.FerryRoute, Trafikverket.SchemaVersions[ObjectType.FerryRoute]);
            query.SetInclude("Name");

            var response = _api.ExecuteRequest(new TrafikverketRequest(query));
            return response.FerryRouteResponse.SingleOrDefault();
        }
    }
}