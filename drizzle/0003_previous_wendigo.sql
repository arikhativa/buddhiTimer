PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_timer_table` (
	`id` integer PRIMARY KEY NOT NULL,
	`duration` integer NOT NULL,
	`warmUp` integer,
	`name` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_timer_table`("id", "duration", "warmUp", "name") SELECT "id", "duration", "warmUp", "name" FROM `timer_table`;--> statement-breakpoint
DROP TABLE `timer_table`;--> statement-breakpoint
ALTER TABLE `__new_timer_table` RENAME TO `timer_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;