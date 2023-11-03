import Link from "next/link";
import { PiChecks as IconDone } from "react-icons/pi";

import { TaskDifficulty } from "~/lib/task/difficulty";
import { api } from "~/lib/trpc/server";
import { cn } from "~/lib/util/class";

export default async function PageHome() {
  const pageData = await api.pageData.home.query();

  return (
    <>
      <h1 className="text-3xl font-bold">Zadatci</h1>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pageData.tasks.map((task) => {
          return (
            <article
              key={task.id}
              className="relative flex flex-col gap-2 rounded-md border border-off-text bg-primary p-4"
            >
              <h2 className="pr-5 text-xl font-bold">
                <Link
                  className="text-off-text hover:text-text hover:underline"
                  href={`/tasks/${task.slug}`}
                >
                  {task.title}
                </Link>
              </h2>

              <p className="whitespace-pre-wrap break-words text-sm">
                {task.description}
              </p>

              <div className="mt-auto flex items-center pt-2">
                <span
                  className={cn(
                    "select-none self-end rounded-md bg-black px-2.5 pb-[3px] pt-0.5 text-xs font-bold leading-normal shadow",
                    {
                      "pb-1 text-green-400":
                        task.difficulty === TaskDifficulty.Easy,
                      "text-yellow-300":
                        task.difficulty === TaskDifficulty.Medium,
                      "text-red-400": task.difficulty === TaskDifficulty.Hard,
                    },
                  )}
                >
                  {task.difficulty}
                </span>

                <Link
                  className="ml-auto rounded-md border-primary bg-off-text px-4 py-2 text-background shadow transition-shadow hover:bg-text hover:text-primary hover:shadow-lg"
                  href={`/tasks/${task.slug}`}
                >
                  Otvori
                </Link>
              </div>

              {task.solved ? (
                <IconDone
                  className="absolute right-2 top-2 text-2xl drop-shadow-[2px_1px_6px_black]"
                  title={`Zadatak riješen ${Intl.DateTimeFormat("hr-HR", {
                    dateStyle: "short",
                    timeStyle: "medium",
                  }).format(task.solved)}`}
                />
              ) : null}
            </article>
          );
        })}
      </div>
    </>
  );
}
