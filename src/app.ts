import { Hono } from "hono";
import ping from "./controllers/ping";
import discovery from "./controllers/discovery";
// import ConsentDecisionHook from "./controllers/patient-consent-consult";
// import Xacml from "./controllers/xacml";
// import SLS from "./controllers/sls";
// import SLSHook from "./controllers/bundle-security-label";
import { setupGlobalMiddlewares } from "./middlewares";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

setupGlobalMiddlewares(app);
// //routes
app.get("/ping", ping);
app.get("/cds-services", discovery);

// app.post("/cds-services/patient-consent-consult", ConsentDecisionHook.post);
// app.post("/xacml", Xacml.post);
// app.post("/sls", SLS.post);
// app.post("/cds-services/bundle-security-label", SLSHook.post);
app.notFound((c) => c.text("Not Found", 404));

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // Get the custom response
    return err.getResponse();
  } else {
    // Handle other errors
    return c.text(err.message, 500);
  }
});

export default {
  port: parseInt(process.env["PORT"] || "3000"),
  fetch: app.fetch
};

export { app };
