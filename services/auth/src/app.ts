import express, { Express } from "express";
import registerRoutes from "./routes.js";
import logger from "./logger.js";
import configExpress from "./config.js";
import dotenv from "dotenv";
import init from "./init-db.js";

init();

dotenv.config({ path: ".env" });

const app: Express = express();
const port = process.env.PORT || 5000;

configExpress(app);
registerRoutes(app);

app.listen(port, () => {
    logger.info(`Auth service running on port : ${port}`);
});
