using System;
using System.Collections.Generic;
using System.Linq;
using FerryTimetableApp.Helpers;
using FerryTimetableApp.Integration.TrafikverketApi;
using Microsoft.AspNetCore.Mvc;
using TrafikverketdotNET.Subs.FerryRouteResponse;

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
        public IEnumerable<string> GetFerryRouteNames()
        {
            return _trafikverketService.GetFerryRouteNames();
        }

        [HttpGet]
        [Route("{routeName}")]
        [Route("{routeName}/upcoming")]
        public IEnumerable<DateTime> GetFutureDepartures(string routeName)
        {
            return GetCurrentWeekDepartures(routeName)
                .Where(dt => dt > DateTime.Now)
                .Take(10);
        }

        [HttpGet]
        [Route("{routeName}/{date}")]
        public IEnumerable<DateTime> GetDailySchedule(string routeName, DateTime date)
        {
            var searchDate = date.Date;

            return FetchWeekDepartures(routeName, searchDate)
                .Where(dt => dt.IsBetween(searchDate, searchDate.AddDays(1)));
        }

        [HttpGet]
        [Route("{routeName}/validity")]
        public Valid GetValidity(string routeName)
        {
            return GetValidity(routeName, DateTime.Now);
        }

        [HttpGet]
        [Route("{routeName}/{date}/validity")]
        public Valid GetValidity(string routeName, DateTime date)
        {
            var timetable = _trafikverketService
                .GetCurrentFerryRouteTimetable(routeName, date);

            return timetable.Valid
                .FirstOrDefault(validity => validity.Contains(date));
        }

        [HttpGet]
        [Route("{routeName}/week/all")]
        public IEnumerable<DateTime> GetCurrentWeekDepartures(string routeName)
        {
            return FetchWeekDepartures(routeName, DateTime.Today);
        }

        [HttpGet]
        [Route("{routeName}/next")]
        public DateTime? GetNextDeparture(string routeName)
        {
            var futureDepartures = FetchWeekDepartures(routeName, DateTime.Today)
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
        public string GetNextDepartureString(string routeName)
        {
            var nextDeparture = GetNextDeparture(routeName);

            return !nextDeparture.HasValue
                ? $"No departures found for route {routeName}"
                : (nextDeparture.Value - DateTime.Now).ToDurationString();
        }

        private IEnumerable<DateTime> FetchWeekDepartures(string routeName, DateTime date)
        {
            var result = new List<DateTime>();
            var searchDate = date.Date;

            var currentTimetable = _trafikverketService
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