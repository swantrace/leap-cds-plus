import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

const errorMessages = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  500: "Internal Server Error"
};

const errorHandler = createMiddleware(async (c, next) => {
  await next();
  if (c.error) {
    if (/^[1-5]\d{2}$/.test(c.error.message)) {
      throw new HTTPException(Number.parseInt(c.error.message) as any, {
        message: errorMessages?.[c.error.message],
        cause: c.error
      });
    } else {
      throw new Error("Internal Server Error");
    }
  }
});

export default errorHandler;
