type TDayOfWeek = "Sun" | "Mon" | "Tues" | "Wed" | "Thu" | "Fri" | "Sat";
type TTimePeriod = "am" | "pm";

type RangeMatch = {
	range0Start: TDayOfWeek;
	range0End?: TDayOfWeek;
	range1Start?: TDayOfWeek;
	range1End?: TDayOfWeek;
	openTime: string;
	openPeriod: TTimePeriod;
	closeTime: string;
	closePeriod: TTimePeriod;
};

export function parseHourRanges(input: string): RangeMatch[] {
	const dayOfTheWeekPattern = (index: number) =>
		`(?:(?<range${index}Start>Sun|Mon|Tues|Wed|Thu|Fri|Sat)(?:-(?<range${index}End>Sun|Mon|Tues|Wed|Thu|Fri|Sat))?)`;
	const timePattern = (name: string) =>
		`(?<${name}Time>\\d+:?\\d*)\\s(?<${name}Period>am|pm)`;
	const regex = new RegExp(
		`${dayOfTheWeekPattern(0)}(?:, )?${dayOfTheWeekPattern(1)}?\\s+${timePattern("open")}\\s-\\s${timePattern("close")}`,
		"gm",
	);

	const parts = input.split(" / ");
	const matches = [];
	for (const part of parts) {
		for (
			let result = regex.exec(part);
			result !== null;
			result = regex.exec(part)
		) {
			matches.push(result?.groups as RangeMatch);
		}
	}

	return matches;
}

type TWeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type TimeRangeEntry = {
	weekday: TWeekdayIndex;
	// TODO: can I set this to be more specific?
	time_open: number;
	time_closed: number;
};

export function generateRangeEntries(ranges: RangeMatch[]): TimeRangeEntry[] {
	const entries: TimeRangeEntry[] = [];
	for (const range of ranges) {
		console.log("range", range);
		const range0Days = getDaysOfWeekForRange(
			range.range0Start,
			range.range0End,
		);
		const range1Days = getDaysOfWeekForRange(
			range?.range1Start,
			range?.range1End,
		);
		const hours = getRangeHours(range);
		const days = range0Days.concat(range1Days);
		console.log(range0Days, range1Days, hours, days);
		entries.push(...days.map((weekday) => ({ weekday, ...hours })));
	}
	return entries;
}

const dayOfTheWeekIndexes = {
	Sun: 0,
	Mon: 1,
	Tues: 2,
	Wed: 3,
	Thu: 4,
	Fri: 5,
	Sat: 6,
};

function getDaysOfWeekForRange(
	startDay?: TDayOfWeek,
	endDay?: TDayOfWeek,
): TWeekdayIndex[] {
	if (!startDay) return [];
	const rangeStart = dayOfTheWeekIndexes[startDay] as TWeekdayIndex;
	if (!endDay) return [rangeStart];
	const rangeEnd = dayOfTheWeekIndexes[endDay];
	const entries: TWeekdayIndex[] = [];

	console.log("rangestart", rangeStart, "rangeEnd", rangeEnd);
	for (let i = rangeStart; i <= rangeEnd; i++) {
		console.log("i", i);
		entries.push(i);
	}
	return entries;
}

function getRangeHours(range: RangeMatch) {
	const { openTime, openPeriod, closeTime, closePeriod } = range;
	const time_open = parseTime(openTime, openPeriod);
	const time_closed = parseTime(closeTime, closePeriod);
	return {
		time_open,
		time_closed,
	};
}

function parseTime(time: string, period: TTimePeriod) {
	const [hour, minutes] = time.split(":");
	return (
		Number(hour) * 100 + Number(minutes ?? 0) + (period === "pm" ? 1200 : 0)
	);
}

export function parseRow(row: string[]) {
	const [name, hours] = row;

	// const ranges = parseHourRanges(hours);

	return {
		name,
		hours,
	};
}
