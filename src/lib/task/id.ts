import { createHash } from "node:crypto";

import { type Session } from "next-auth";

import { type Task } from "~/server/db/schema";

type UserId = Session["user"]["id"];
type TaskId = Task["id"];

export const generateUserTaskId = ({
  userId,
  taskId,
  maxLength = 0,
}: {
  userId: UserId;
  taskId: TaskId;
  maxLength?: number;
}) => {
  const hash = createHash("sha256");
  hash.update(userId, "utf-8");
  hash.update("$", "utf-8");
  hash.update(taskId.toString(), "utf-8");
  const digest = hash.digest();

  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (const i of new Uint8Array(digest)) {
    result += alphabet[i % alphabet.length];
  }

  const ret = maxLength > 0 ? result.substring(0, maxLength) : result;

  return ret;
};

export const generateFlag = (
  props:
    | {
        userSpecific: true;
        userId: UserId;
        taskId: TaskId;
        flagBase: string;
      }
    | {
        userSpecific: false;
        flagBase: string;
      },
): `COMP_CTF{${string}}` => {
  if (!props.userSpecific) {
    return `COMP_CTF\{${props.flagBase}\}`;
  }

  const { userId, taskId, flagBase } = props;
  const userTaskId = generateUserTaskId({
    userId,
    taskId,
    maxLength: 8,
  });

  const contents = `${flagBase}${userTaskId}`;

  return `COMP_CTF\{${contents}\}`;
};
