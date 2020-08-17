// borrowed from https://gist.github.com/ranwahle/e78a8859ff78bdd68055017fc5875fcb ...and fixed

const MILLISECONDS_IN_A_SECOND: number = 1000;
const SECONDS_IN_A_MINUTE: number = 60;
const MINUTES_IN_AN_HOUR: number = 60;
const HOURS_IN_A_DAY: number = 24;

const MILLISECONDS_IN_A_MINUTE = MILLISECONDS_IN_A_SECOND * SECONDS_IN_A_MINUTE;
const MILLISECONDS_IN_AN_HOUR = MILLISECONDS_IN_A_MINUTE * MINUTES_IN_AN_HOUR;
const MILLISECONDS_IN_A_DAY = MILLISECONDS_IN_AN_HOUR * HOURS_IN_A_DAY;

export default class TimeSpan {
	static Subtract(date1: any, date2: any) {
		let milliSeconds: number = date1 - date2;

		return new TimeSpan(milliSeconds);
	}

	constructor(milliSeconds: number = 0) {
    this._totalMilliSeconds = 0;
    this._milliseconds = 0;
		this._seconds = 0;
		this._minutes = 0;
		this._hours = 0;
    this._days = 0;

		this.milliseconds = milliSeconds;
	}

	addTo(date: Date): Date {
		date.setMilliseconds(date.getMilliseconds() + this.totalMilliSeconds);

		return date;
	}

	subtructFrom(date: Date): Date {
		date.setMilliseconds(date.getMilliseconds() - this.totalMilliSeconds);

		return date;
	}

  private _milliseconds: number;
	private _totalMilliSeconds: number;
	private _seconds: number;
	private _minutes: number;
	private _hours: number;
	private _days: number;

	get days(): number {
		return this._days;
	}
	set days(value: number) {
		if (isNaN(value)) {
			value = 0;
		}
		this._days = value;
		this.calcMilliSeconds();
	}

	get hours(): number {
		return this._hours;
	}
	set hours(value: number) {
		if (isNaN(value)) {
			value = 0;
		}
		this._hours = value;
		this.calcMilliSeconds();
	}

	get minutes(): number {
		return this._minutes;
	}
	set minutes(value: number) {
		if (isNaN(value)) {
			value = 0;
		}
		this._minutes = value;
		this.calcMilliSeconds();
	}

	get seconds(): number {
		return this._seconds;
	}
	set seconds(value: number) {
		this._seconds = value;
		this.calcMilliSeconds();
	}

	get milliseconds(): number {
		return this._milliseconds;
	}
	set milliseconds(value: number) {
		if (isNaN(value)) {
			value = 0;
		}
		this._milliseconds = value;
		this.calcMilliSeconds();
	}

	get totalMilliSeconds() {
		return this._totalMilliSeconds;
	}

	get totalSeconds() {
		return Math.round(this._totalMilliSeconds / MILLISECONDS_IN_A_SECOND);
	}

	get totalMinutes() {
		return Math.round(this._totalMilliSeconds / MILLISECONDS_IN_A_MINUTE);
	}

	get totalHours() {
		return Math.round(this._totalMilliSeconds / MILLISECONDS_IN_AN_HOUR);
	}

	private roundValue(origValue: number, maxValue: number) {
		return { modulu: origValue % maxValue, addition: Math.floor(origValue / maxValue) };
	}

	private calcMilliSeconds() {
		let newMilliSecond = this.roundValue(this._milliseconds, MILLISECONDS_IN_A_SECOND);
		this._milliseconds = newMilliSecond.modulu;
		this._seconds += newMilliSecond.addition;

		let newSecond = this.roundValue(this._seconds, SECONDS_IN_A_MINUTE);
		this._seconds = newSecond.modulu;
		this._minutes += newSecond.addition;

		let newminutes = this.roundValue(this._minutes, MINUTES_IN_AN_HOUR);
		this._minutes = newminutes.modulu;
		this._hours += newminutes.addition;

		let newDays = this.roundValue(this._hours, HOURS_IN_A_DAY);
		this._hours = newDays.modulu;
		this._days += newDays.addition;

    this._totalMilliSeconds = this.days * MILLISECONDS_IN_A_DAY
      + this.hours * MILLISECONDS_IN_AN_HOUR
      + this.minutes * MILLISECONDS_IN_A_MINUTE
      + this.seconds * MILLISECONDS_IN_A_SECOND
      + this.milliseconds;
    }

    public toString(approximateTime = false) {
      let parts = [
        { label: 'days', value: this.days },
        { label: 'hours', value: this.hours },
        { label: 'minutes', value: this.minutes }
      ];

      if (!approximateTime) {
        parts.push({ label: 'seconds', value: this.seconds });
      }

      parts = parts.filter(({ value }) => value > 0);

      if (parts.length === 0) {
        return null;
      }

      if (approximateTime) {
        parts[parts.length - 1].value += 1;
      }

      if (parts.length === 1) {
        return this.durationStringPart(parts[0]);
      }

      const tail = this.durationStringPart(parts[parts.length - 1]);
      const start = parts
        .slice(0, parts.length - 1)
        .map(this.durationStringPart)
        .join(', ');

      return [start, tail].join(' and ');
    }

    private durationStringPart(part: ({ label: string, value: number })) {
      return [part.value, part.label].join(' ');
    }
}