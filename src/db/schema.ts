import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const restaurantsTable = sqliteTable("restaurants", {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
});

export const restaurantHoursTable = sqliteTable("restaurant_hours", {
	restaurant_id: int().notNull(),
	weekday: int().notNull(),
	time_open: int().notNull(),
	time_closed: int().notNull(),
});
