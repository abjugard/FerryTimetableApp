using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using FerryTimetableApp.Model;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;

namespace FerryTimetableApp.Integration.Trafikverket
{
    public class TrafikverketClient : ITrafikverketClient
    {
        private readonly IOptions<AppConfiguration> _config;

        private TrafikverketIntegrationConfigSection IntegrationConfig => _config.Value.TrafikverketIntegration;

        private string ApiKey => IntegrationConfig.ApiKey;

        private string Referrer => IntegrationConfig.Referrer;

        public TrafikverketClient(IOptions<AppConfiguration> config)
        {
            this._config = config;
        }

        public async Task<TrafikverketApiResponse<FerryRouteApiResponse>> GetFerryRouteData(string routeName)
        {
            var query =
                $@"<FILTER>
                      <EQ name=""Name"" value=""{routeName}"" />
                </FILTER>
                <INCLUDE>Timetable</INCLUDE>";

            return await GetTrafikverketApiResponse(query, 2);
        }

        public async Task<TrafikverketApiResponse<FerryRouteApiResponse>> GetFerryRouteNames()
        {
            return await GetTrafikverketApiResponse("<INCLUDE>Name</INCLUDE>");
        }

        private async Task<TrafikverketApiResponse<FerryRouteApiResponse>> GetTrafikverketApiResponse(string query, int? limit = null)
        {
            var limitString = limit.HasValue ? $"limit=\"{limit.ToString()}\" " : "";

            var client = new HttpClient();
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri("https://api.trafikinfo.trafikverket.se/v1.2/data.json"),
                Headers =
                {
                    {HeaderNames.Referer, Referrer},
                },
                Content = new StringContent(
                    $@"<REQUEST>
                          <LOGIN authenticationkey=""{ApiKey}"" />
                          <QUERY {limitString}objecttype=""FerryRoute"" schemaversion=""1.2"">
                                {query}
                          </QUERY>
                    </REQUEST>"
                )
            };

            using var response = await client.SendAsync(request);

            response.EnsureSuccessStatusCode();

            var body = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<TrafikverketApiResponse<FerryRouteApiResponse>>(body);
        }
    }
}