import "winston-daily-rotate-file";

import pino from "pino";
import winston from "winston";

import { env } from "~/env.mjs";

const { format } = winston;

const KB = 1024;
const MB = 1024 * KB;

export const logger = winston.createLogger({
  level: "debug",
  format: format.json(),
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: format.cli(),
    }),
    new winston.transports.File({
      level: "error",
      filename: "error.log",
      dirname: env.APP_LOG_DIR,
      zippedArchive: true,
      maxsize: 5 * MB,
      maxFiles: 20,
      tailable: true,
    }),
    new winston.transports.File({
      level: "info",
      filename: "combined.log",
      dirname: env.APP_LOG_DIR,
      zippedArchive: true,
      maxsize: 5 * MB,
      maxFiles: 10,
      tailable: true,
    }),
    new winston.transports.File({
      level: "debug",
      filename: "debug.log",
      dirname: env.APP_LOG_DIR,
      zippedArchive: true,
      maxsize: 5 * MB,
      maxFiles: 3,
      tailable: true,
    }),
  ],
});

export const baseLog = pino({
  name: "comp-ctf",
  level: "trace",
  browser: {
    asObject: true,
  },
  base: {
    env: process.env.NODE_ENV,
  },
  timestamp: true,
});
