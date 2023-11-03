ALTER TABLE "task" ALTER COLUMN "position" SET NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "position_idx" ON "task" ("position");