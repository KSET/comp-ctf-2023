DO $$ BEGIN
 CREATE TYPE "TaskDifficulty" AS ENUM('easy', 'medium', 'hard');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "taskSolves" (
	"taskId" integer NOT NULL,
	"userId" text NOT NULL,
	"startedAt" timestamp DEFAULT now() NOT NULL,
	"finishedAt" timestamp,
	"metadata" json DEFAULT '{}' NOT NULL,
	CONSTRAINT taskSolves_taskId_userId PRIMARY KEY("taskId","userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"text" text NOT NULL,
	"difficulty" "TaskDifficulty" NOT NULL,
	"position" integer,
	CONSTRAINT "task_slug_unique" UNIQUE("slug"),
	CONSTRAINT "task_position_unique" UNIQUE("position")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskSolves" ADD CONSTRAINT "taskSolves_taskId_task_id_fk" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskSolves" ADD CONSTRAINT "taskSolves_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
