import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

// TODO: schema for restaurants
// TODO: schema for restaurant hours

export const restaurantsTable = sqliteTable("restaurants", {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
});

export const restaurantHoursTable = sqliteTable("restaurant_hours", {
	restaurant_id: int().notNull(),
	day_of_week: int().notNull(),
	time_open: int().notNull(),
	time_closed: int().notNull(),
});
