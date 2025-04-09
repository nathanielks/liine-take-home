import fp from "fastify-plugin";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { parse } from "@fast-csv/parse";
import { Writable } from "node:stream";
import { parseRow } from "../parser/index.js";
import { restaurantsTable, restaurantHoursTable } from "../db/schema.js";

export type DbPluginOptions = {};

export default fp<DbPluginOptions>(async (fastify, opts) => {
	// TODO: implement query method

	const db = drizzle({
		connection: { url: ":memory:" },
	});
	await initDb(db, { shouldSeed: true });

	fastify.decorate("db", db);
});

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
	export interface FastifyInstance {
		db: LibSQLDatabase;
		queryRestaurants(): string[];
	}
}

async function initDb(db: LibSQLDatabase, { shouldSeed = false } = {}) {
	await migrate(db, {
		migrationsFolder: "./drizzle",
	});

	if (shouldSeed) {
		const csvStream = createReadStream("./restaurants.csv");
		const parseStream = parse({ headers: true });
		const seedStream = new DatabaseSeedStream(db);
		await pipeline(csvStream, parseStream, seedStream);
	}
}

interface RestaurantCsvRow {
	"Restaurant Name": string;
	Hours: string;
}

class DatabaseSeedStream extends Writable {
	db: LibSQLDatabase;
	constructor(db: LibSQLDatabase) {
		super({ objectMode: true });
		this.db = db;
	}

	async _write(
		{ "Restaurant Name": _name, Hours: _hours }: RestaurantCsvRow,
		encoding: BufferEncoding,
		callback: (error?: Error | null) => void,
	) {
		const { name, entries } = parseRow([_name, _hours]);
		const [inserted] = await this.db
			.insert(restaurantsTable)
			.values({ name })
			.returning();
		const mappedEntries = entries.map((entry) => ({
			...entry,
			restaurant_id: inserted.id,
		}));
		await this.db.insert(restaurantHoursTable).values(mappedEntries);
		callback();
	}
}
