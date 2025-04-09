import fp from "fastify-plugin";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { parse } from "@fast-csv/parse";
import { Writable } from "node:stream";

// import { eq } from 'drizzle-orm';
// import { usersTable } from '../db/schema.js';

export type DbPluginOptions = {};

export default fp<DbPluginOptions>(async (fastify, opts) => {
	// TODO: set up drizzle
	// TODO: parse restaurants.csv
	// TODO: seed db
	// TODO: implement query method

	// You can specify any property from the libsql connection options
	const db = drizzle({
		connection: { url: process.env.DB_FILE_NAME ?? "file:file.db" },
	});
	await initDb(db);

	fastify.decorate("db", function () {
		return db;
	});

	fastify.decorate("queryRestaurants", function (): string[] {
		return [];
	});
});

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
	export interface FastifyInstance {
		db: typeof drizzle;
		queryRestaurants(): string[];
	}
}

type CsvRow = {
	name: string;
	hours: string;
};
async function initDb(db: LibSQLDatabase) {
	await migrate(db, {
		migrationsFolder: "./drizzle",
	});

	const csvStream = createReadStream("./restaurants.csv");
	const parseStream = parse({ headers: true });
	const seedStream = new DatabaseSeedStream(db);
	parseStream.write("name,hours\n");
	await pipeline(csvStream, parseStream, seedStream);
}

class DatabaseSeedStream extends Writable {
	db: LibSQLDatabase;
	constructor(db: LibSQLDatabase) {
		super({ objectMode: true });
		this.db = db;
	}

	_write(
		chunk: CsvRow,
		encoding: BufferEncoding,
		callback: (error?: Error | null) => void,
	) {
		console.log("chunk", chunk);
		callback();
	}
}
