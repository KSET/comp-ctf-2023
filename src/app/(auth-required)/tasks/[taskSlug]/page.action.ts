"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { handleFlagVerification } from "~/lib/services/task-service";
import { getServerAuthSession } from "~/server/auth";

const flagSubmitValidator = z.object({
  id: z.preprocess((v) => v && Number(v), z.number().min(1)),
  flag: z.string(),
});

export type FlagActionState =
  | null
  | {
      status: "success";
    }
  | {
      status: "error";
      message: string;
    };

export const submitFlagAction = async (
  { id }: { id: number },
  prevState: FlagActionState,
  data: FormData,
): Promise<FlagActionState> => {
  const session = await getServerAuthSession();
  if (!session) {
    return {
      status: "error",
      message: "Niste prijavljeni",
    };
  }

  const userId = session.user.id;

  const validation = await flagSubmitValidator.safeParseAsync({
    id,
    flag: data.get("flag"),
  });

  if (!validation.success) {
    return {
      status: "error",
      message: validation.error.issues
        .map((x) => `${x.path.join(".")}: ${x.message}`)
        .join("\n"),
    };
  }

  const { id: taskId, flag: userSubmittedFlag } = validation.data;

  const flagVerification = await handleFlagVerification({
    userId,
    taskId,
    userSubmittedFlag,
  });

  if (flagVerification.status === "success") {
    revalidatePath("/home");
  }

  return flagVerification;
};
