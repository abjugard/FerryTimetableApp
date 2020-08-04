using System;
using System.Collections.Generic;
using System.Linq;

namespace FerryTimetableApp.Helpers
{
    public static class TimeSpanExtensions
    {
        public static string ToDurationString(this TimeSpan ts)
        {
            static string DurationStringPart((string Label, int Value) part)
            {
                var (label, value) = part;
                return $"{value.ToString()} {label}";
            }

            var parts = new List<(string Label, int Value)>
            {
                ("days", ts.Days),
                ("hours", ts.Hours),
                ("minutes", ts.Minutes),
                ("seconds", ts.Seconds)
            }.Where(t => t.Value > 0).ToList();

            if (parts.Count == 1)
            {
                return DurationStringPart(parts.First());
            }

            var tail = DurationStringPart(parts.Last());

            var start = string.Join(", ", parts.SkipLast(1).Select(DurationStringPart));

            return $"{start} and {tail}";
        }
    }
}