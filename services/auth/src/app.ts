import express, { Express, NextFunction, Request, Response } from "express";
import registerRoutes from "./routes.js";
import logger from "./utils/logger.js";
import configExpress from "./config.js";
import dotenv from "dotenv";
import init from "./db/init-db.js";
import util from "./utils/commonUtils.js";

init();

dotenv.config({ path: ".env" });

const app: Express = express();
const port = process.env.PORT || 5000;

configExpress(app);
registerRoutes(app);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Catched exception in global error handler : ${err}`);
    res.status(500).json(util.errorResp("Internal Server Error"));
});

app.listen(port, () => {
    logger.info(`Auth service running on port : ${port}`);
});
