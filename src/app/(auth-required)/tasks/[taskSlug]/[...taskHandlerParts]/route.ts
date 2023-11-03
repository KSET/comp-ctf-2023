import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import { type NextRequest } from "next/server";

import { logger } from "~/lib/server/log";
import { runTaskHandler } from "~/lib/task/handlers";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { type NextAppRouteContext } from "~/types/next";

export const revalidate = 0;

type Context = NextAppRouteContext<{ taskSlug: string }>;

const runHandler = async (params: {
  slug: string;
  request: NextRequest;
  ctx: Context;
}) => {
  const session = await getServerAuthSession();

  if (!session) {
    throw new Response(null, {
      status: 403,
    });
  }

  const { user } = session;

  const task = await db.query.tasks.findFirst({
    where: (t, { eq }) => eq(t.slug, params.slug),
    with: {
      solves: {
        where: (s, { eq }) => eq(s.userId, user.id),
      },
    },
  });

  if (!task) {
    throw new Response(null, {
      status: 404,
    });
  }

  const [taskSolve] = task.solves;

  if (!taskSolve) {
    throw new Response(null, {
      status: 404,
    });
  }

  const handlerResult = await runTaskHandler({
    task,
    taskSolve,
    user,
  });

  if (!handlerResult) {
    throw new Response(null, {
      status: 404,
    });
  }

  return handlerResult;
};

const handler = async (
  request: NextRequest,
  ctx: NextAppRouteContext<{ taskSlug: string; taskHandlerParts: string[] }>,
) => {
  let handlerResult: Awaited<ReturnType<typeof runHandler>>;
  try {
    handlerResult = await runHandler({
      ctx,
      slug: ctx.params.taskSlug,
      request,
    });
  } catch (e) {
    if (e instanceof Response) {
      return e;
    }

    logger.error(e);
    return new Response(null, {
      status: 500,
    });
  }

  const { file, httpHandler } = handlerResult;

  if (
    file &&
    request.method.toUpperCase() === "GET" &&
    ctx.params.taskHandlerParts[0] === "download"
  ) {
    const fileBuffer = await fs.readFile(file);
    const filename = path.basename(file);

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  if (httpHandler) {
    return httpHandler(request, ctx.params.taskHandlerParts);
  }

  return new Response(null, {
    status: 404,
  });
};

export const GET = handler;
export const HEAD = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;
