namespace FerryTimetableApp.Model
{
    public class AppConfiguration
    {
        public TrafikverketIntegrationConfigSection TrafikverketIntegration { get; set; }
    }

    public class TrafikverketIntegrationConfigSection
    {
        public string ApiKey { get; set; }

        public string Referrer { get; set; }
    }
}