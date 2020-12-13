using System;
using System.Linq;
using TrafikverketdotNET.Subs.FerryRouteResponse;

namespace FerryTimetableApp.Helpers
{
    public static class TrafikverketModelExtensions
    {
        public static bool Contains(this Valid validity, DateTime dt)
        {
            return dt.IsBetween(validity.From, validity.To);
        }

        public static int DayOfWeek(this Weekday weekday)
        {
            return (weekday.Id == 8 ? 1 : weekday.Id) - 1;
        }

        public static DateTime DateTimeInWeek(this Weekday weekday, DateTime forWeek)
        {
            return forWeek.Date
                .StartOfWeek()
                .AddDays(weekday.DayOfWeek())
                .Date;
        }

        public static (int Hour, int Minute) TimeParts(this Schedule schedule)
        {
            var timeParts = schedule.Time.Split(':')
                .Select(int.Parse)
                .ToList();

            return (timeParts[0], timeParts[1]);
        }
    }
}