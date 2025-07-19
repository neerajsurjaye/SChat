import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import configExpress from "./utils/config.js";
import { Server } from "socket.io";
import { createServer } from "node:http";
import logger from "./utils/logger.js";
import configSocket from "./socket/chat.js";
import registerRoutes from "./routes.js";
import commonUtils from "./utils/commonUtils.js";

dotenv.config({ path: ".env" });
const port = process.env.PORT || 5000;

let app: Express = express();
const currServer = createServer(app);
const io = new Server(currServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

configExpress(app);
registerRoutes(app);

configSocket(io);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.send("Chat Gateway test");
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Catched exception in global error handler :`, err);
    res.status(500).json(commonUtils.errorResp("Internal Server Error"));
});

currServer.listen(port, () => {
    logger.info(`Listening on ${port}`);
});
