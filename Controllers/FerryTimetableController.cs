using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FerryTimetableApp.Model;
using FerryTimetableApp.Helpers;
using FerryTimetableApp.Integration.Trafikverket;
using Microsoft.AspNetCore.Mvc;

namespace FerryTimetableApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FerryTimetableController : ControllerBase
    {
        private readonly ITrafikverketService _trafikverketService;

        public FerryTimetableController(ITrafikverketService trafikverketService)
        {
            _trafikverketService = trafikverketService;
        }

        [HttpGet]
        [Route("names")]
        public async Task<IEnumerable<string>> GetFerryRouteNames()
        {
            return await _trafikverketService.GetFerryRouteNames();
        }

        [HttpGet]
        [Route("{routeName}")]
        [Route("{routeName}/upcoming")]
        public async Task<IEnumerable<DateTime>> GetFutureDepartures(string routeName)
        {
            return (await GetCurrentWeekDepartures(routeName))
                .Where(dt => dt > DateTime.Now)
                .Take(10);
        }

        [HttpGet]
        [Route("{routeName}/{date}")]
        public async Task<IEnumerable<DateTime>> GetDailySchedule(string routeName, DateTime date)
        {
            var searchDate = date.Date;

            return (await FetchWeekDepartures(routeName, searchDate))
                .Where(dt => dt.IsBetween(searchDate, searchDate.AddDays(1)));
        }

        [HttpGet]
        [Route("{routeName}/validity")]
        public async Task<TimetableValidity> GetValidity(string routeName)
        {
            return await GetValidity(routeName, DateTime.Now);
        }

        [HttpGet]
        [Route("{routeName}/{date}/validity")]
        public async Task<TimetableValidity> GetValidity(string routeName, DateTime date)
        {
            var timetable = await _trafikverketService
                .GetCurrentFerryRouteTimetable(routeName, date);

            return timetable.Valid
                .FirstOrDefault(validity => validity.Contains(date));
        }

        [HttpGet]
        [Route("{routeName}/week/all")]
        public async Task<IEnumerable<DateTime>> GetCurrentWeekDepartures(string routeName)
        {
            return await FetchWeekDepartures(routeName, DateTime.Today);
        }

        [HttpGet]
        [Route("{routeName}/next")]
        public async Task<DateTime?> GetNextDeparture(string routeName)
        {
            var futureDepartures = (await FetchWeekDepartures(routeName, DateTime.Today))
                .Where(dt => dt >= DateTime.Now)
                .ToList();

            if (!futureDepartures.Any())
            {
                return null;
            }

            return futureDepartures.First();
        }

        [HttpGet]
        [Route("{routeName}/next/in")]
        public async Task<string> GetNextDepartureString(string routeName)
        {
            var nextDeparture = await GetNextDeparture(routeName);

            return !nextDeparture.HasValue
                ? $"No departures found for route {routeName}"
                : (nextDeparture.Value - DateTime.Now).ToDurationString();
        }

        private async Task<IEnumerable<DateTime>> FetchWeekDepartures(string routeName, DateTime date)
        {
            var result = new List<DateTime>();
            var searchDate = date.Date;

            var currentTimetable = await _trafikverketService
                .GetCurrentFerryRouteTimetable(routeName, searchDate);

            if (currentTimetable == null)
            {
                return result;
            }

            result.AddRange(
                from period in currentTimetable.Period
                let scheduleEntries = period.Schedule
                    .Where(HasNoDeviations)
                from entry in scheduleEntries
                let time = entry.TimeParts()
                from weekday in period.Weekday
                select weekday
                    .DateTimeInWeek(searchDate)
                    .AddHours(time.Hour)
                    .AddMinutes(time.Minute)
            );

            return result
                .Distinct()
                .OrderBy(_ => _);
        }

        private static bool HasNoDeviations(Schedule schedule)
        {
            return schedule.Deviation == null || !schedule.Deviation.Any();
        }
    }
}