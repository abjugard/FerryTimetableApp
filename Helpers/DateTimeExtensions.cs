using System;

namespace FerryTimetableApp.Helpers
{
    public static class DateTimeExtensions
    {
        public static bool IsBetween(this DateTime dt, DateTime start, DateTime end)
        {
            return dt >= start && dt <= end;
        }

        public static DateTime StartOfWeek(this DateTime dt, DayOfWeek startOfWeek = DayOfWeek.Sunday)
        {
            return dt.AddDays(-1 * ((7 + (dt.DayOfWeek - startOfWeek)) % 7))
                .Date;
        }
    }
}