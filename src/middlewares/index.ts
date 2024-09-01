import type { Hono } from "hono";
import { logger } from "hono/logger";
import trustProxy from "./common/trustProxy";
import errorHandler from "./common/errorHandler";

export const setupGlobalMiddlewares = (app: Hono) => {
  app.use(trustProxy);
  process.env.NODE_ENV === "production" || app.use(logger());
  app.use(errorHandler);
};
