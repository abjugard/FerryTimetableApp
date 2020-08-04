using System;
using System.Collections.Generic;
using System.Linq;

#region R# disables

// ReSharper disable ClassNeverInstantiated.Global
// ReSharper disable CollectionNeverUpdated.Global
// ReSharper disable InconsistentNaming
// ReSharper disable UnusedAutoPropertyAccessor.Global

#endregion

namespace FerryTimetableApp.Model
{
    public class TrafikverketApiResponse<T>
        where T : ITrafikverketApiResponse
    {
        public ResultResponse<T> RESPONSE { get; set; }
    }

    public class ResultResponse<T>
        where T : ITrafikverketApiResponse
    {
        public List<T> RESULT { get; set; }
    }

    public class FerryRouteApiResponse : ITrafikverketApiResponse
    {
        public List<FerryRoute> FerryRoute { get; set; }
    }

    public class FerryRoute
    {
        public string Name { get; set; }

        public List<FerryRouteTimetable> Timetable { get; set; }
    }

    public class FerryRouteTimetable
    {
        public int Priority { get; set; }

        public List<TimetableValidity> Valid { get; set; }

        public List<TimetablePeriod> Period { get; set; }
    }

    public class TimetableValidity
    {
        public DateTime From { get; set; }

        public DateTime To { get; set; }
    }

    public class TimetablePeriod
    {
        public string Name { get; set; }

        public int SortOrder { get; set; }

        public List<Weekday> Weekday { get; set; }

        public List<Schedule> Schedule { get; set; }
    }

    public class Weekday
    {
        public string Day { get; set; }

        public int Id { get; set; }
    }

    public class Schedule
    {
        public string Time { get; set; }

        public Harbor Harbor { get; set; }

        public int SortOrder { get; set; }

        public StopType StopType { get; set; }

        public List<Deviation> Deviation { get; set; }
    }

    public class Harbor
    {
        public int Id { get; set; }

        public string Name { get; set; }
    }

    public class StopType
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public bool Visible { get; set; }
    }

    public class Deviation
    {
        public string Description { get; set; }

        public DeviationType DeviationType { get; set; }

        public string Id { get; set; }
    }

    public class DeviationType
    {
        public string Id { get; set; }

        public string Name { get; set; }
    }
}