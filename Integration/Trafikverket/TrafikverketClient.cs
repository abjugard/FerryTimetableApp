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
            return await GetTrafikverketApiResponse(new [] {("Name", routeName)}, 2, "Timetable");
        }

        public async Task<TrafikverketApiResponse<FerryRouteApiResponse>> GetFerryRouteNames()
        {
            return await GetTrafikverketApiResponse("Name");
        }

        private async Task<TrafikverketApiResponse<FerryRouteApiResponse>> GetTrafikverketApiResponse(params string[] fields)
        {
            return await GetTrafikverketApiResponse(null, null, fields);
        }

        private async Task<TrafikverketApiResponse<FerryRouteApiResponse>> GetTrafikverketApiResponse(
            (string Name, string Value)[] eqFilters,
            int? resultLimit,
            params string[] fields)
        {
            var client = new HttpClient();

            var auth = Tag("LOGIN", ("authenticationkey", ApiKey));

            var limitValue = resultLimit.HasValue
                ? resultLimit.ToString()
                : string.Empty;

            var query = Tag("QUERY",
                ConstructEqFilter(eqFilters) + ConstructIncludes(fields),
                ("limit", limitValue), ("objecttype", "FerryRoute"), ("schemaversion", "1.2"));

            var requestContent = Tag("REQUEST", auth + query);

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri("https://api.trafikinfo.trafikverket.se/v1.2/data.json"),
                Headers =
                {
                    {HeaderNames.Referer, Referrer},
                },
                Content = new StringContent(requestContent)
            };

            using var response = await client.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var body = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<TrafikverketApiResponse<FerryRouteApiResponse>>(body);
        }

        private static string ConstructEqFilter((string Name, string Value)[] eqFilters)
        {
            if (eqFilters == null)
            {
                return "";
            }

            var filters = eqFilters
                .Select(filter => Tag("EQ", ("name", filter.Name), ("value", filter.Value)));

            return Tag("FILTER", string.Join("", filters));
        }

        private static string ConstructIncludes(string[] fields)
        {
            var includes = fields
                .Select(field => Tag("INCLUDE", field));

            return string.Join("", includes);
        }

        private static string Tag(string tag, params (string Key, string Value)[] attrs)
        {
            return Tag(tag, null, attrs);
        }

        private static string Tag(string tag, string content = null, params (string Key, string Value)[] attrs)
        {
            var attrString = string.Join(" ", attrs
                .Where(attr => !string.IsNullOrEmpty(attr.Value))
                .Select(attr => $"{attr.Key}=\"{attr.Value}\"")
            );

            if (!string.IsNullOrEmpty(attrString))
            {
                attrString = " " + attrString;
            }

            var selfClosing = content == null;

            var openTagEnd = selfClosing ? "/" : "";

            var openTag = $"<{tag}{attrString}{openTagEnd}>";

            return selfClosing ? openTag : $"{openTag}{content}</{tag}>";
        }
    }
}