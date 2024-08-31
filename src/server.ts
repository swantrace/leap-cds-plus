import dotenv from "dotenv";
dotenv.config();

import { app } from "./app";

import logger from "./lib/logger";

const port = parseInt(process.env["PORT"] || "3000");
app.listen(port, () => logger.info(`Listening on port ${port}!`));
