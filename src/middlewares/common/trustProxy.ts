import { createMiddleware } from "hono/factory";

const trustProxy = createMiddleware(async (c, next) => {
  const xForwardedFor = c.req.header("x-forwarded-for");

  if (xForwardedFor) {
    const forwardedIps = xForwardedFor.split(",").map((ip) => ip.trim());
    c.set("originalIp", forwardedIps[0]);
  } else {
    // Fallback to the direct connection IP if no `X-Forwarded-For` header is present
    c.set(
      "originalIp",
      c.req.header("cf-connecting-ip") || c.req.header("x-real-ip") || "unknown"
    );
  }

  // Proceed to the next middleware or route handler
  await next();
});

export default trustProxy;
