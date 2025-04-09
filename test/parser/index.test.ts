import { describe, test } from "node:test";
import * as assert from "node:assert";
import {
	generateRangeEntries,
	parseHourRanges,
} from "../../src/parser/index.js";

describe("CSV Parser", () => {
	test("parses ranges", (t) => {
		const tests = [
			{
				input: "Mon-Sun 11:00 am - 10 pm",
				expectation: [
					{
						range0Start: "Mon",
						range0End: "Sun",
						range1Start: undefined,
						range1End: undefined,
						openTime: "11:00",
						openPeriod: "am",
						closeTime: "10",
						closePeriod: "pm",
					},
				],
			},
			{
				input: "Mon-Fri, Sat 11 am - 12 pm",
				expectation: [
					{
						range0Start: "Mon",
						range0End: "Fri",
						range1Start: "Sat",
						range1End: undefined,
						openTime: "11",
						openPeriod: "am",
						closeTime: "12",
						closePeriod: "pm",
					},
				],
			},
			{
				input: "Fri-Sun 11 am - 12 pm",
				expectation: [
					{
						range0Start: "Fri",
						range0End: "Sun",
						range1Start: undefined,
						range1End: undefined,
						openTime: "11",
						openPeriod: "am",
						closeTime: "12",
						closePeriod: "pm",
					},
				],
			},
			{
				input:
					"Mon-Wed 5 pm - 12:30 am / Thu-Fri 5 pm - 1:30 am / Sat 3 pm - 1:30 am / Sun 3 pm - 11:30 pm",
				expectation: [
					{
						range0Start: "Mon",
						range0End: "Wed",
						range1Start: undefined,
						range1End: undefined,
						openTime: "5",
						openPeriod: "pm",
						closeTime: "12:30",
						closePeriod: "am",
					},
					{
						range0Start: "Thu",
						range0End: "Fri",
						range1Start: undefined,
						range1End: undefined,
						openTime: "5",
						openPeriod: "pm",
						closeTime: "1:30",
						closePeriod: "am",
					},
					{
						range0Start: "Sat",
						range0End: undefined,
						range1Start: undefined,
						range1End: undefined,
						openTime: "3",
						openPeriod: "pm",
						closeTime: "1:30",
						closePeriod: "am",
					},
					{
						range0Start: "Sun",
						range0End: undefined,
						range1Start: undefined,
						range1End: undefined,
						openTime: "3",
						openPeriod: "pm",
						closeTime: "11:30",
						closePeriod: "pm",
					},
				],
			},
		];
		for (const { input, expectation } of tests) {
			assert.deepEqual(parseHourRanges(input), expectation);
		}
	});

	test("generates range objects", () => {
		// input: "Mon-Sun 11:00 am - 10 pm",
		const tests = [
			{
				enabled: false,
				input: "Mon 11:00 am - 10 pm",
				expectation: [
					{
						weekday: 1,
						time_open: 1100,
						time_closed: 2200,
					},
				],
			},
			{
				input: "Fri-Sun 08:00 am - 10 pm",
				expectation: [
					{
						weekday: 0,
						time_open: 800,
						time_closed: 2200,
					},
					{
						weekday: 5,
						time_open: 800,
						time_closed: 2200,
					},
					{
						weekday: 6,
						time_open: 800,
						time_closed: 2200,
					},
				],
			},
			{
				enabled: false,
				input: "Sun-Sat 11:00 am - 10 pm",
				expectation: [
					{
						weekday: 0,
						time_open: 1100,
						time_closed: 2200,
					},
					{
						weekday: 1,
						time_open: 1100,
						time_closed: 2200,
					},
					{
						weekday: 2,
						time_open: 1100,
						time_closed: 2200,
					},
					{
						weekday: 3,
						time_open: 1100,
						time_closed: 2200,
					},
					{
						weekday: 4,
						time_open: 1100,
						time_closed: 2200,
					},
					{
						weekday: 5,
						time_open: 1100,
						time_closed: 2200,
					},
					{
						weekday: 6,
						time_open: 1100,
						time_closed: 2200,
					},
				],
			},
		];
		for (const { enabled, input, expectation } of tests) {
			if (enabled === false) continue;
			console.log("input", input);
			const ranges = parseHourRanges(input);
			const entries = generateRangeEntries(ranges);
			assert.deepEqual(entries, expectation);
		}
	});
});
