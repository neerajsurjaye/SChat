import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import configExpress from "./utils/config.js";
import { Server } from "socket.io";
import { createServer } from "node:http";
import logger from "./utils/logger.js";
import configSocket from "./socket/chat.js";
import registerRoutes from "./routes.js";
import commonUtils from "./utils/commonUtils.js";
import { createAdapter } from "@socket.io/redis-adapter";
import { Redis } from "ioredis";
import { log } from "node:console";

dotenv.config({ path: ".env" });
const port = process.env.PORT || 5000;

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = Number(process.env.REDIS_PORT);

commonUtils.checkEnv({ REDIS_HOST, REDIS_PORT });

let app: Express = express();

//** Testing paths */
app.use((req: Request, res: Response, next: NextFunction) => {
    logger.error(`req.path: ${req.path}`);
    logger.error(`req.originalUrl: ${req.originalUrl}`);
    logger.error(`req.url: ${req.url}`);
    next();
});
logger.error("Registered Logger");
log("Checking with console.log");

const currServer = createServer(app);

const pubClient = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    tls: {},
});
const subClient = pubClient.duplicate();

const io = new Server(currServer, {
    path: "/socket.io",
    adapter: createAdapter(pubClient, subClient),
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

configExpress(app);
// depriciated
// registerRoutes(app);

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
