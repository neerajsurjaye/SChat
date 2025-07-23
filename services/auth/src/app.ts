import express, { Express, NextFunction, Request, Response } from "express";
import registerRoutes from "./routes.js";
import logger from "./utils/logger.js";
import configExpress from "./utils/config.js";
import dotenv from "dotenv";
import commonUtils from "./utils/commonUtils.js";
import initdb from "./db/init-db.js";

dotenv.config({ path: ".env" });

const app: Express = express();
const PORT = process.env.PORT;

commonUtils.checkEnv({ PORT });

initdb();
configExpress(app);
registerRoutes(app);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Catched exception in global error handler :`, err);
    res.status(500).json(commonUtils.errorResp("Internal Server Error"));
});

app.listen(PORT, () => {
    logger.info(`Auth service running on port : ${PORT}`);
});
