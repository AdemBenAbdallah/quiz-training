-- Add missing columns to user_payment table
ALTER TABLE "user_payment"
ADD COLUMN IF NOT EXISTS "bundle_type" text,
ADD COLUMN IF NOT EXISTS "certificate_count" integer,
ADD COLUMN IF NOT EXISTS "purchased_certificates" text;

-- Update existing records to have default values for the new columns
UPDATE "user_payment"
SET
  "bundle_type" = COALESCE("bundle_type", 'individual'),
  "certificate_count" = COALESCE("certificate_count", 1)
WHERE "bundle_type" IS NULL OR "certificate_count" IS NULL;

-- Add NOT NULL constraints after setting default values
ALTER TABLE "user_payment"
ALTER COLUMN "bundle_type" SET NOT NULL,
ALTER COLUMN "certificate_count" SET NOT NULL;

-- Ensure timestamp columns exist and have proper defaults
ALTER TABLE "user_payment"
ALTER COLUMN "created_at" SET DEFAULT NOW(),
ALTER COLUMN "updated_at" SET DEFAULT NOW();

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_payment_updated_at ON "user_payment";
CREATE TRIGGER update_user_payment_updated_at
    BEFORE UPDATE ON "user_payment"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
