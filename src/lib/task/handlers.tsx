/* eslint-disable @typescript-eslint/require-await */
import "server-only";

import { existsSync, mkdirSync } from "node:fs";
import fs from "node:fs/promises";
import { join as joinPath } from "node:path";

import { and, eq } from "drizzle-orm";
import JSZip from "jszip";
import Script from "next/script";
import { type NextRequest, NextResponse } from "next/server";
import { type Session } from "next-auth";
import { type ReactNode } from "react";
import { z } from "zod";

import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { type Task, type TaskSolve, taskSolves } from "~/server/db/schema";

import { getSessionToken } from "../auth/session-token";
import { logger } from "../server/log";
import { SetCookieComponent } from "./handlers.client";

export const HANDLER_FILE_STORAGE_BASE_DIR = joinPath(
  env.APP_FILE_STORAGE_DIR,
  "task-handlers",
);

export const HANDLER_ASSETS_DIR = joinPath(
  new URL(import.meta.url).pathname,
  "../../../../public/task-data/",
);

type User = Session["user"];

export type TaskHandlerCtx = {
  user: User;
  task: Task;
  taskSolve: TaskSolve;
};

export type TaskHandlerReturn = {
  variables?: Record<string, string>;
  file?: string;
  component?: () => ReactNode;
  httpHandler?: (
    req: NextRequest,
    params: string[],
  ) => Promise<Response> | Response;
};

export type TaskHandler = (ctx: TaskHandlerCtx) => Promise<TaskHandlerReturn>;

if (!existsSync(HANDLER_FILE_STORAGE_BASE_DIR)) {
  mkdirSync(HANDLER_FILE_STORAGE_BASE_DIR, {
    recursive: true,
  });
}

const getPerUserTaskStorageDir = (ctx: {
  taskId: Task["id"];
  userId: User["id"];
}) => {
  const path = joinPath(
    HANDLER_FILE_STORAGE_BASE_DIR,
    ctx.taskId.toString(),
    ctx.userId,
  );

  mkdirSync(path, {
    recursive: true,
  });

  return path;
};

export const runTaskHandler = (
  ctx: TaskHandlerCtx,
  disabled = false,
): Promise<null | TaskHandlerReturn> => {
  if (disabled) {
    return Promise.resolve(null);
  }

  const key = ctx.task.handler;

  if (!key || !(key in taskHandlers)) {
    return Promise.resolve(null);
  }

  const handler = taskHandlers[key as HandlerKey];

  if (!handler) {
    return Promise.resolve(null);
  }

  return handler(ctx).catch((e) => {
    logger.error(e);

    return null;
  });
};

export type HandlerKey = keyof typeof taskHandlers;

const bf = {
  code: {
    // set up an array of values from 8 to 128, by 8s
    base: "++++++++[>+>++>+++>++++>+++++>++++++>+++++++>++++++++>+++++++++>++++++++++>+++++++++++>++++++++++++>+++++++++++++>++++++++++++++>+++++++++++++++>++++++++++++++++<<<<<<<<<<<<<<<<-]",
    slot: {
      increment: ">",
      decrement: "<",
    },
    pointer: {
      increment: "+",
      decrement: "-",
    },
    output: ".",
  },
  fuckit(text: string) {
    const makeCode = function (c: number) {
      // make the bf code for this character
      let charCode = "";
      // set the slot
      const slot = Math.round(c / 8);
      for (let i = 0; i < slot; i++) {
        charCode += bf.code.slot.increment;
      }
      // set the pointer
      let pointerDiff: number;
      let pointer: string | undefined;
      let pointerReversed: string | undefined;
      if (c > slot * 8) {
        pointerDiff = c;
        pointerDiff -= slot * 8;
        pointer = bf.code.pointer.increment;
        pointerReversed = bf.code.pointer.decrement;
      } else if (c < slot * 8) {
        pointerDiff = slot * 8;
        pointerDiff -= c;
        pointer = bf.code.pointer.decrement;
        pointerReversed = bf.code.pointer.increment;
      } else {
        pointerDiff = 0;
      }
      for (let i = 0; i < pointerDiff; i++) {
        if (pointer !== undefined) {
          charCode += pointer;
        }
      }
      // output the character
      charCode += bf.code.output;
      // reset the pointer
      for (let i = 0; i < pointerDiff; i++) {
        charCode += pointerReversed;
      }
      // reset the slot
      for (let i = 0; i < slot; i++) {
        charCode += bf.code.slot.decrement;
      }
      // return our bf code
      return charCode;
    };
    let code = bf.code.base;
    const txt2fck = text;
    for (let i = 0; i < txt2fck.length; i++) {
      code += makeCode(txt2fck.charCodeAt(i));
    }
    code += bf.code.output;
    return code;
  },
};

const encodeTxtSpeak = (text: string) => {
  // 1: .,?!-&':
  const charMap = {
    a: "2",
    b: "22",
    c: "222",
    d: "3",
    e: "33",
    f: "333",
    g: "4",
    h: "44",
    i: "444",
    j: "5",
    k: "55",
    l: "555",
    m: "6",
    n: "66",
    o: "666",
    p: "7",
    q: "77",
    r: "777",
    s: "7777",
    t: "8",
    u: "88",
    v: "888",
    w: "9",
    x: "99",
    y: "999",
    z: "9999",
    " ": "0",
    "{": "111",
    "}": "1111",
    _: "11111",
  } as Record<string, string>;

  const lowerText = text.toLowerCase();
  const ret = [] as string[];
  for (let i = 0; i < text.length; i++) {
    const char = lowerText[i];
    if (char === undefined) {
      continue;
    }

    const mapped = charMap[char];
    if (mapped) {
      ret.push(mapped);
    }
  }

  return ret.join(" ");
};

type TGenerateOutput = {
  fileName: string;
  contents: Buffer;
};
const getOrGenerateFile = async <
  TMeta extends TaskHandlerCtx["taskSolve"]["metadata"],
>(params: {
  meta: {
    key: string;
    data: TMeta;
  };
  ctx: {
    userId: User["id"];
    taskId: Task["id"];
  };
  generate: () => TGenerateOutput | Promise<TGenerateOutput>;
}) => {
  const metaValidator = z
    .object({
      [params.meta.key]: z.string(),
    })
    .partial()
    .passthrough();

  const metaValid = await metaValidator.safeParseAsync(params.meta.data);

  if (!metaValid.success) {
    throw new Error(
      metaValid.error.issues
        .map((x) => `${x.path.join(".")}: ${x.message}`)
        .join("\n"),
    );
  }

  const meta = metaValid.data;

  // If file was already generated
  {
    const existingTextFile = meta[params.meta.key];

    if (existingTextFile && existsSync(existingTextFile)) {
      return {
        file: existingTextFile,
      };
    }
  }

  const generatedOutput = await params.generate();

  const fileOutputPath = joinPath(
    getPerUserTaskStorageDir({
      taskId: params.ctx.taskId,
      userId: params.ctx.userId,
    }),
    generatedOutput.fileName,
  );

  await fs.writeFile(fileOutputPath, generatedOutput.contents);

  await db
    .update(taskSolves)
    .set({
      metadata: {
        ...meta,
        [params.meta.key]: fileOutputPath,
      },
    })
    .where(
      and(
        eq(taskSolves.userId, params.ctx.userId),
        eq(taskSolves.taskId, params.ctx.taskId),
      ),
    )
    .execute();

  return {
    file: fileOutputPath,
  };
};

const textFont = (() => {
  const rawChars = "abcdefghijklmnopqrstuvwxyz_{}?!";
  const raw = `
    ▄▀█ █▄▄ █▀▀ █▀▄ █▀▀ █▀▀ █▀▀ █ █ █   █ █▄▀ █   █▀▄▀█ █▄ █ █▀█ █▀█ █▀█ █▀█ █▀ ▀█▀ █ █ █ █ █ █ █ ▀▄▀ █▄█ ▀█      ▄▀ ▀▄ ▀█ █
    █▀█ █▄█ █▄▄ █▄▀ ██▄ █▀  █▄█ █▀█ █ █▄█ █ █ █▄▄ █ ▀ █ █ ▀█ █▄█ █▀▀ ▀▀█ █▀▄ ▄█  █  █▄█ ▀▄▀ ▀▄▀▄▀ █ █  █  █▄ ▄▄▄▄ ▀▄ ▄▀  ▄ ▄
  `.trim();
  const charTopBottomParts = raw.split("\n").map((x) => x.trim().split(" "));
  const charToVisible = (char: string) => {
    switch (char) {
      case " ":
        return [0, 0];
      case "█":
        return [1, 1];
      case "▀":
        return [1, 0];
      case "▄":
        return [0, 1];
      default:
        throw new Error(`Unknown char: ${char}`);
    }
  };
  const charList = charTopBottomParts[0]!.map((top, i) => [
    top.split("").map(charToVisible),
    charTopBottomParts[1]![i]!.split("").map(charToVisible),
  ]);

  if (charList.length !== rawChars.length) {
    throw new Error(
      `Invalid char list length: ${charList.length} vs ${rawChars.length}`,
    );
  }

  const res = charList.map((char, i) => {
    const charWidth = char[0]!.length;

    type Char = 0 | 1;
    type CharRow = Char[];

    return [
      rawChars[i]!,
      [
        Array.from({ length: charWidth }).map((_, i) => char[0]![i]![0]),
        Array.from({ length: charWidth }).map((_, i) => char[0]![i]![1]),
        Array.from({ length: charWidth }).map((_, i) => char[1]![i]![0]),
        Array.from({ length: charWidth }).map((_, i) => char[1]![i]![1]),
      ],
    ] as [string, [CharRow, CharRow, CharRow, CharRow]];
  });

  return Object.fromEntries(res);
})();

const asTextFont = (
  text: string,
  toneMap: {
    empty: string;
    filled: string;
  } = {
    empty: " ",
    filled: "█",
  },
) => {
  const chars = text.toLowerCase().split("");
  const fontChars = chars.map((c) => textFont[c] ?? textFont["?"]!);
  const rows = 4;

  let str = "";
  for (let row = 0; row < rows; row++) {
    for (const char of fontChars) {
      const charRow = char[row as 0 | 1 | 2 | 3];
      for (const filled of charRow) {
        if (filled) {
          str += toneMap.filled;
        } else {
          str += toneMap.empty;
        }
      }
      str += " ";
    }
    str += "\n";
  }

  return str;
};

const taskHandlers = {
  "jpeg-with-zip": (ctx) => {
    return getOrGenerateFile({
      meta: {
        key: "zipLocation",
        data: ctx.taskSolve.metadata,
      },
      ctx: {
        taskId: ctx.task.id,
        userId: ctx.user.id,
      },
      generate: async () => {
        const zipFile = new JSZip();
        zipFile.file("flag.txt", ctx.taskSolve.flag, {
          compression: "DEFLATE",
          compressionOptions: {
            level: 9,
          },
        });
        const zipBuffer = await zipFile.generateAsync({
          type: "nodebuffer",
          compression: "DEFLATE",
          compressionOptions: {
            level: 9,
          },
        });

        const imgBuffer = await fs.readFile(
          joinPath(HANDLER_ASSETS_DIR, "jpeg-with-zip", "zip.jpeg"),
        );
        const imgBufferLen = imgBuffer.length;
        const imgBufferSplitAt = imgBufferLen * (2 / 3);
        const imgBufferFirstPart = imgBuffer.subarray(0, imgBufferSplitAt);
        const imgBufferSecondPart = imgBuffer.subarray(imgBufferSplitAt);

        const joinedBuffers = Buffer.concat([
          imgBufferFirstPart,
          zipBuffer,
          imgBufferSecondPart,
        ]);

        return {
          fileName: "zip.jpeg",
          contents: joinedBuffers,
        };
      },
    });
  },

  "add-flag-to-page-in-link-tag-url": async (ctx) => {
    return {
      component: () => (
        <Script
          src={`/ctf-util/VERY_NORMAL_LINK_TO_A_SCRIPT/?flag=${ctx.taskSolve.flag}`}
        />
      ),
    };
  },

  "add-cookie-with-flag": async (ctx) => {
    return {
      component: () => {
        return (
          <SetCookieComponent
            cookieName="__Sеcurе.CTF-Flag"
            cookiePath={`/tasks/${ctx.task.slug}`}
            flag={ctx.taskSolve.flag}
          />
        );
      },
    };
  },

  "add-%%BRAINFUCK%%-variable-to-text": async (ctx) => {
    return {
      variables: {
        BRAINFUCK: bf.fuckit(ctx.taskSolve.flag),
      },
    };
  },

  "add-%%TEXT_CODE%%-variable-to-text": async (ctx) => {
    return {
      variables: {
        TEXT_CODE: encodeTxtSpeak(ctx.taskSolve.flag),
      },
    };
  },

  "http-postar": async (ctx) => {
    const sessionToken = getSessionToken();

    if (!sessionToken) {
      throw new Error("Session cookie not found");
    }

    return {
      variables: {
        ENDPOINT_URL: `/ctf-util/r/${ctx.task.slug}/poštar`,
        SESSION_ID: sessionToken,
      },
      httpHandler: async (req, params) => {
        if (params[0] !== "poštar" && params[1] !== ctx.task.slug) {
          const error = "Nepoznata ruta. Nešto nedostaje.";
          return new NextResponse(error, {
            status: 404,
            headers: {
              "x-error": error,
            },
          });
        }

        if (req.method.toUpperCase() !== "POST") {
          const error = `Kriva metoda: ${req.method}`;
          return new NextResponse(error, {
            status: 405,
            headers: {
              "x-error": error,
            },
          });
        }

        const bodyText = await req.text();

        if (bodyText.length < 3) {
          const error = "Nedostaje tijelo zahtjeva. Mora biti barem 3 znaka.";
          return new Response(error, {
            status: 400,
            headers: {
              "x-error": error,
            },
          });
        }

        const toHeader = req.headers.get("to");
        if (!toHeader || toHeader !== "KSET") {
          const error = !toHeader
            ? "Nedostaje primatelj."
            : `Primatelj (to) nije valjan. Ne znam tko je ${toHeader}.`;
          return new NextResponse(error, {
            status: 404,
            headers: {
              "x-error": error,
            },
          });
        }

        const respText = `
Pozdrav,

Moja omiljena životinja je isto ${bodyText}!
Kako divno!

Još jednom hvala što ste mi pisali.
Drago mi je vidjeti kako ljudi još šalju ručno pisana pisma.

S poštovanjem,
Vaš ${ctx.taskSolve.flag}
`.trim();

        return new NextResponse(respText, {
          status: 200,
        });
      },
    };
  },
  "poruka-u-hex-bojama": async (ctx) => {
    const { file } = await getOrGenerateFile({
      meta: {
        key: "textLocation",
        data: ctx.taskSolve.metadata,
      },
      ctx: {
        taskId: ctx.task.id,
        userId: ctx.user.id,
      },
      generate: async () => {
        const text = asTextFont(ctx.taskSolve.flag, {
          filled: "#fff",
          empty: "#000",
        })
          .replaceAll(" ", "#000")
          .replaceAll("#", ",#")
          .replaceAll("\n,", "\n")
          .replace(/^\,/, "");
        return {
          fileName: "hexFontFlag.txt",
          contents: Buffer.from(text),
        };
      },
    });

    return {
      variables: {
        MESSAGE: asTextFont("Sretno!", {
          empty: " ",
          filled: "█",
        }),
      },
      file,
    };
  },

  "ascii-base-36": async (ctx) => {
    const encoded = ctx.taskSolve.flag
      .split("")
      .map((x) => x.charCodeAt(0).toString(36))
      .join(" ");

    return {
      variables: {
        ENCODED_FLAG: encoded,
      },
    };
  },
} satisfies Record<string, TaskHandler>;

export const taskHandlerKeys = Object.keys(taskHandlers) as HandlerKey[];
