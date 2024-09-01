import { createMiddleware } from "hono/factory";

const ping = createMiddleware(async (c) => {
  const requestedError = c.req.query("error");
  if (requestedError === "bad_request") {
    throw new Error("400");
  } else if (requestedError === "internal_error") {
    throw new Error("500");
  } else {
    return c.text("pong");
  }
});

export default ping;
