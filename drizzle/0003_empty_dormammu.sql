ALTER TABLE "user_level_progress_v2" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_payment_v2" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_quiz_progress" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_quiz_progress_v2" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "user_level_progress_v2" CASCADE;--> statement-breakpoint
DROP TABLE "user_payment_v2" CASCADE;--> statement-breakpoint
DROP TABLE "user_quiz_progress" CASCADE;--> statement-breakpoint
DROP TABLE "user_quiz_progress_v2" CASCADE;--> statement-breakpoint
ALTER TABLE "user_payment" ALTER COLUMN "product_slug" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_level_progress" ADD COLUMN "certificate_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user_payment" ADD COLUMN "certificate_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user_level_progress" ADD CONSTRAINT "user_level_progress_certificate_id_certificates_id_fk" FOREIGN KEY ("certificate_id") REFERENCES "public"."certificates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_payment" ADD CONSTRAINT "user_payment_certificate_id_certificates_id_fk" FOREIGN KEY ("certificate_id") REFERENCES "public"."certificates"("id") ON DELETE cascade ON UPDATE no action;