CREATE TABLE "certificates" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"total_levels" integer DEFAULT 8 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "certificates_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "user_level_progress_v2" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"certificate_id" text NOT NULL,
	"level_id" integer NOT NULL,
	"passed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_payment_v2" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"certificate_id" text NOT NULL,
	"payment_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"amount" integer,
	"currency" text DEFAULT 'USD',
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_payment_v2_payment_id_unique" UNIQUE("payment_id")
);
--> statement-breakpoint
CREATE TABLE "user_quiz_progress_v2" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"certificate_id" text NOT NULL,
	"level_id" integer NOT NULL,
	"part_id" integer NOT NULL,
	"passed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_reminder_sent_at" timestamp;--> statement-breakpoint
ALTER TABLE "user_level_progress_v2" ADD CONSTRAINT "user_level_progress_v2_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_level_progress_v2" ADD CONSTRAINT "user_level_progress_v2_certificate_id_certificates_id_fk" FOREIGN KEY ("certificate_id") REFERENCES "public"."certificates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_payment_v2" ADD CONSTRAINT "user_payment_v2_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_payment_v2" ADD CONSTRAINT "user_payment_v2_certificate_id_certificates_id_fk" FOREIGN KEY ("certificate_id") REFERENCES "public"."certificates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_quiz_progress_v2" ADD CONSTRAINT "user_quiz_progress_v2_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_quiz_progress_v2" ADD CONSTRAINT "user_quiz_progress_v2_certificate_id_certificates_id_fk" FOREIGN KEY ("certificate_id") REFERENCES "public"."certificates"("id") ON DELETE cascade ON UPDATE no action;