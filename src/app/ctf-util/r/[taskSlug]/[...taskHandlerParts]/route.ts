import "server-only";

import { type NextRequest } from "next/server";

import { getSessionToken } from "~/lib/auth/session-token";
import { logger } from "~/lib/server/log";
import { runTaskHandler } from "~/lib/task/handlers";
import { db } from "~/server/db";
import { type NextAppRouteContext } from "~/types/next";

export const revalidate = 0;

type Context = NextAppRouteContext<{ taskSlug: string }>;

const runHandler = async (params: {
  slug: string;
  request: NextRequest;
  ctx: Context;
}) => {
  const sessionToken = getSessionToken(params.request);

  if (!sessionToken) {
    throw new Response(null, {
      status: 403,
    });
  }

  const user = await db.query.sessions
    .findFirst({
      where: (s, { eq }) => eq(s.sessionToken, sessionToken),
      with: {
        user: true,
      },
    })
    .then((x) => x?.user);

  if (!user) {
    throw new Response("Not authenticated", {
      status: 403,
    });
  }

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

  const { httpHandler } = handlerResult;

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
