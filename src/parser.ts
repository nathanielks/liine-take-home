#!/usr/bin/env ts-node

import * as csv from "@fast-csv/parse";

csv
	.parseStream(process.stdin)
	.on("error", (error) => console.error(error))
	.on("data", (row) => console.log(row))
	.on("end", (rowCount: number) => console.log(`Parsed ${rowCount} rows`));
