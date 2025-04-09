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

const DAYS_IN_WEEK = 7;

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

type TTimeRangeEntry = {
	weekday: TWeekdayIndex;
	// TODO: can I set this to be more specific?
	time_open: number;
	time_closed: number;
};

export function generateRangeEntries(ranges: RangeMatch[]): TTimeRangeEntry[] {
	const entries: TTimeRangeEntry[] = [];
	for (const range of ranges) {
		const range0Days = getDaysOfWeekForRange(
			range.range0Start,
			range.range0End,
		);
		const range1Days = getDaysOfWeekForRange(
			range?.range1Start,
			range?.range1End,
		);
		const days = range0Days.concat(range1Days);
		for (const weekdayIndex of days) {
			const openHours = getRangeHours(range);
			for (const { weekdayOffset, time_open, time_closed } of openHours) {
				entries.push({
					weekday: ((weekdayIndex + weekdayOffset) %
						DAYS_IN_WEEK) as TWeekdayIndex,
					time_open,
					time_closed,
				});
			}
		}
	}
	return entries.sort((a, z) => a.weekday - z.weekday);
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

	// NOTE: because ranges can overlap into the next week (eg Fri-Sun), we add 7
	// to the end of the range and use a modulo to reset that value backwithin
	// the 0-6 range of indexes.
	const _rangeEnd = dayOfTheWeekIndexes[endDay];
	const rangeEnd = _rangeEnd < rangeStart ? _rangeEnd + 7 : _rangeEnd;
	const set = new Set<TWeekdayIndex>();
	for (let i = rangeStart; i <= rangeEnd; i++) {
		set.add((i % 7) as TWeekdayIndex);
	}
	return Array.from(set).sort();
}

function getRangeHours(range: RangeMatch) {
	const { openTime, openPeriod, closeTime, closePeriod } = range;
	const time_open = parseTime(openTime, openPeriod);
	const time_closed = parseTime(closeTime, closePeriod);
	if (time_closed < time_open) {
		const items = [
			{
				time_open,
				time_closed: 2400,
				weekdayOffset: 0,
			},
		];
		if (time_closed > 0) {
			items.push({
				time_open: 0,
				time_closed,
				weekdayOffset: 1,
			});
		}
		return items;
	}
	// Otherwise it's all within the same day
	return [
		{
			time_open,
			time_closed,
			weekdayOffset: 0,
		},
	];
}

function parseTime(time: string, period: TTimePeriod) {
	const [_hour, minutes] = time.split(":");
	const hour = time.startsWith("12") ? 0 : Number(_hour);
	return hour * 100 + Number(minutes ?? 0) + (period === "pm" ? 1200 : 0);
}

export interface RestaurantCsvRow {
	name: string;
	entries: TTimeRangeEntry[];
}
export function parseRow(row: string[]): RestaurantCsvRow {
	const [name, hours] = row;
	const ranges = parseHourRanges(hours);
	const entries = generateRangeEntries(ranges);
	return {
		name,
		entries,
	};
}
