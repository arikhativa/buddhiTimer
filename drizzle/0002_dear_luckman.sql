CREATE TABLE `intervalBell_table` (
	`id` integer PRIMARY KEY NOT NULL,
	`reference` text DEFAULT 'fromStart' NOT NULL,
	`duration` integer NOT NULL,
	`timerId` integer NOT NULL,
	FOREIGN KEY (`timerId`) REFERENCES `timer_table`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `timer_table` (
	`id` integer PRIMARY KEY NOT NULL,
	`duration` integer NOT NULL,
	`warmUp` integer
);
