export function parseHours(input: string) {
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
		console.log("start of part", part);
		for (
			let result = regex.exec(part);
			result !== null;
			result = regex.exec(part)
		) {
			matches.push(result?.groups);
		}
	}

	// NOTE: in cases where closeTime is _the next day_, perhaps we should diff the open and close times and store the diff instead of the open and close times? Store the open time as a time, and then store open hours.
	// QSTN: But what about cases where restaurants are open for periods during the day? That's not presently part of the problem set, so not going to worry about that.
	return matches;
}

export function parseRow(row: string[]) {
	const [name, hours] = row;

	return {
		name,
		hours,
	};
}
