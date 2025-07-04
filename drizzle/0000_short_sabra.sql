CREATE TABLE `options` (
	`id` integer PRIMARY KEY NOT NULL,
	`question_id` integer,
	`option` text NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` integer PRIMARY KEY NOT NULL,
	`quiz_id` integer,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `quizzes` (
	`id` integer PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
