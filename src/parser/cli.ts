#!/usr/bin/env ts-node

import * as csv from "@fast-csv/parse";
import { parseRow } from "./index.js";

csv
	.parseStream(process.stdin)
	.on("error", (error) => console.error(error))
	.on("data", (row) => console.log(parseRow(row)))
	.on("end", (rowCount: number) => console.log(`Parsed ${rowCount} rows`));
