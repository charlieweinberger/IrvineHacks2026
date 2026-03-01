CREATE TABLE `cars` (
	`id` text PRIMARY KEY NOT NULL,
	`driver_id` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `participant_state` (
	`participant_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`status` text DEFAULT 'awaiting' NOT NULL,
	`is_officer` integer DEFAULT false NOT NULL,
	`app_notes` text DEFAULT '' NOT NULL,
	`preferred_ride_partners` text DEFAULT '' NOT NULL,
	`car_id` text,
	`seat_index` integer,
	`check_in_state` text,
	`updated_at` integer NOT NULL
);
