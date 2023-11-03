import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { $metadata } from "~/lib/page/metadata";
import { runTaskHandler } from "~/lib/task/handlers";
import { api } from "~/lib/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { type NextAppPageProps } from "~/types/next";

import { submitFlagAction } from "./page.action";
import { SubmitFlagFormInputs } from "./page.client";

const pageDataFn = cache(({ slug }: { slug: string }) => {
  return api.pageData.tasks.info.query({
    slug,
  });
});

export const generateMetadata = async (
  props: NextAppPageProps<{
    taskSlug: string;
  }>,
) => {
  const pageData = await pageDataFn({
    slug: props.params.taskSlug,
  });

  if (!pageData) {
    return null;
  }

  return $metadata({
    title: pageData.task.title,
    description: pageData.task.description,
  });
};

const dateTimeFormatter = Intl.DateTimeFormat("hr-HR", {
  dateStyle: "short",
  timeStyle: "medium",
});

export default async function PageTask(
  props: NextAppPageProps<{
    taskSlug: string;
  }>,
) {
  const pageData = await pageDataFn({
    slug: props.params.taskSlug,
  });

  if (!pageData) {
    notFound();
    return null;
  }

  const { task } = pageData;
  const body = pageData.task.text.replaceAll("%%FLAG%%", pageData.flag);
  const { attempt } = pageData.task;

  const taskSolved = Boolean(attempt?.finishedAt);

  const taskHandlerData = await runTaskHandler(
    {
      task: pageData.task,
      taskSolve: {
        ...pageData.task.attempt,
        flag: pageData.flag,
      },
      user: (await getServerAuthSession())!.user,
    },
    taskSolved,
  );

  const hasFileToDownload = taskHandlerData?.file;
  const HandlerComponent = taskHandlerData?.component ?? (() => null);

  let finalBody = body;
  if (taskHandlerData?.variables) {
    const entries = Object.entries(taskHandlerData.variables);
    for (const [variableName, variableValue] of entries) {
      finalBody = finalBody.replaceAll(`%%${variableName}%%`, variableValue);
    }
  }

  return (
    <>
      <div>
        <Link className="hover:text-white hover:underline" href="/home">
          &larr; natrag
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Zadatak: {task.title}</h1>

        <section>
          <h3 className="text-xl font-bold">Opis:</h3>

          <p
            dangerouslySetInnerHTML={{
              __html: finalBody,
            }}
            className="prose whitespace-pre-wrap break-words text-justify"
          />
        </section>

        {hasFileToDownload ? (
          <section>
            <h3 className="text-xl font-bold">Datoteka</h3>

            <p>
              <a
                className="text-off-text underline hover:text-text hover:no-underline"
                href={`/tasks/${task.slug}/download`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Link na datoteku
              </a>
            </p>
          </section>
        ) : null}

        <HandlerComponent />

        <section>
          {attempt?.finishedAt ? (
            <div className="flex max-w-prose flex-col gap-4 text-off-text">
              <h2 className="text-xl font-bold">Rješenje:</h2>
              <pre className="whitespace-pre-wrap rounded-md bg-primary px-2 py-1 text-off-text">
                {pageData.flag}
              </pre>
              <div>
                Zadatak riješen{" "}
                <time dateTime={attempt.finishedAt.toISOString()}>
                  {dateTimeFormatter.format(attempt.finishedAt)}
                </time>
              </div>
            </div>
          ) : (
            <form
              className="flex max-w-prose flex-col gap-4 text-off-text"
              action={
                submitFlagAction.bind(
                  null,
                  {
                    id: task.id,
                  },
                  null,
                ) as (data: FormData) => never
              }
            >
              <SubmitFlagFormInputs taskId={task.id} />
            </form>
          )}
        </section>
      </div>
    </>
  );
}
