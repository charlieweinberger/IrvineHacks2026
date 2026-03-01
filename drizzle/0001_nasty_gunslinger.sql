ALTER TABLE `participant_state` ADD `driver` integer;--> statement-breakpoint
ALTER TABLE `participant_state` ADD `self_driver` integer;--> statement-breakpoint
ALTER TABLE `participant_state` ADD `seats` integer;--> statement-breakpoint
ALTER TABLE `participant_state` ADD `driver_capacity_review_approved` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `participant_state` ADD `notes_review_approved` integer DEFAULT false NOT NULL;