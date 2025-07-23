import express, { NextFunction, Request, Response } from "express";
import initConsumer from "./initConsumer.js";
import commonUtils from "./utils/commonUtils.js";
import logger from "./utils/logger.js";
import registerRoutes from "./routes.js";
import initdb from "./db/init-db.js";

const PORT = process.env.PORT;
commonUtils.checkEnv({ PORT });

initdb();
initConsumer();

const app = express();
registerRoutes(app);

app.get("/", (req: Request, res: Response) => {
    res.send("message archiver");
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Catched exception in global error handler :`, err);
    res.status(500).json(commonUtils.errorResp("Internal Server Error"));
});

app.listen(PORT, () => {
    logger.info(`Message archiver listening on port :: ${PORT}`);
});
