import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

import { ping } from "./controllers/ping";
import { error } from "./controllers/error";
import { discovery } from "./controllers/discovery";
import ConsentDecisionHook from "./controllers/patient-consent-consult";
import Xacml from "./controllers/xacml";
import SLS from "./controllers/sls";
import SLSHook from "./controllers/bundle-security-label";

const app = express();

//trust proxy
app.set("trust proxy", true);

//middlewares
process.env.NODE_ENV === "production" || app.use(morgan("dev"));
app.use(bodyParser.json({ type: "application/json" }));

//routes
app.get("/ping", ping);

app.get("/cds-services", discovery);

app.post("/cds-services/patient-consent-consult", ConsentDecisionHook.post);
app.post("/xacml", Xacml.post);
app.post("/sls", SLS.post);
app.post("/cds-services/bundle-security-label", SLSHook.post);

app.use(error);

export { app };
