import { TimetableValidity } from "../types/TimetableValidity";

export async function http<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};

export async function fetchUpcoming(ferryRoute: string): Promise<Date[]> {
    const url = ['ferrytimetable', ferryRoute, 'upcoming'].join('/');

    return http<Date[]>(url)
        .then(array => array.map(item => new Date(item)));
};

export async function fetchDaySchedule(ferryRoute: string, date: Date): Promise<Date[]> {
    const url = ['ferrytimetable', ferryRoute, date.toISOString()].join('/');

    return http<Date[]>(url)
        .then(array => array.map(item => new Date(item)));
};

export async function fetchValidity(ferryRoute: string, date: Date): Promise<TimetableValidity> {
    const url = ['ferrytimetable', ferryRoute, date.toISOString(), 'validity'].join('/');

    return http<TimetableValidity>(url)
        .then(validity => new TimetableValidity(validity.from, validity.to));
};

export async function fetchNames(): Promise<string[]> {
    const url = ['ferrytimetable', 'names'].join('/');

    return http<string[]>(url);
};