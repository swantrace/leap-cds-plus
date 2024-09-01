import { createMiddleware } from "hono/factory";
import serviceDefinitions from "../schemas/service-definitions.json";

const discovery = createMiddleware(async (c) => {
  return c.json({
    services: serviceDefinitions
  });
});

export default discovery;
