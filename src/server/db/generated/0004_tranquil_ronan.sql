ALTER TABLE "taskSolves" ADD COLUMN "flag" text NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "flagBase" text NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "flagUserSpecific" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "handler" text;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "hidden" boolean DEFAULT false NOT NULL;