CREATE TABLE `restaurant_hours` (
	`restaurant_id` integer NOT NULL,
	`day_of_week` integer NOT NULL,
	`time_open` integer NOT NULL,
	`time_closed` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `restaurants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
