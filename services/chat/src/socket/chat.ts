import dotenv from "dotenv";
import { DefaultEventsMap, Server, Socket } from "socket.io";
import logger from "../utils/logger.js";
import commonUtils from "../utils/commonUtils.js";
import constants from "../utils/constants.js";
import HandleAmqp from "../rabbitmq/handleAmqp.js";
import { Redis } from "ioredis";

dotenv.config({ path: ".env" });

const AUTH_URL = process.env.AUTH_URL;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = Number(process.env.REDIS_PORT);

commonUtils.checkEnv({ AUTH_URL });

const redis = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
});
redis.on("error", (err) => {
    logger.error("Got error from redis", err);
});

let queueConnection: HandleAmqp;

function configSocket(
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
    io.use(async (socket, next) => {
        const rawToken = socket.handshake.headers.authorization;

        if (!rawToken) {
            return next(new Error("Authentication Error! No Token"));
        }

        try {
            const resp = await commonUtils.fetchGet(
                AUTH_URL,
                "/v1/user/verify",
                {
                    headers: {
                        Authorization: rawToken,
                    },
                }
            );
            if (resp.status != 200) {
                return next(
                    new Error(
                        `Error from auth : ${resp.json?.message} : with status ${resp.status}`
                    )
                );
            }
            const user = resp.json?.data?.username;
            if (!user) {
                logger.error("User is null");
                return next(new Error(`User is null`));
            }
            socket.data.user = user;
            return next();
        } catch (err) {
            logger.error(`Got exception while trying to verify JWT ${err}`);
            return next(
                new Error(`Got exception while trying to verify JWT ${err}`)
            );
        }
    });

    io.on("connection", async (socket: Socket) => {
        const userid: string = String(socket.data.user);
        console.debug("New User Connected");

        if (await redis.exists(userid)) {
            socket.emit(
                constants.SOCKET_EVENT_ERROR,
                `User already connected in another tab cannot connect`
            );
            return;
        }

        await redis.set(userid, socket.id);

        socket.emit(
            constants.SOCKET_EVENT_STATUS,
            `Connected!! Welcome user : ${socket.data?.user}`
        );

        socket.on(constants.SOCKET_EVENT_MESSAGE, async (data) => {
            const receiverid = await redis.get(data.to);

            if (!data.to || data.to == "") {
                socket.emit(
                    constants.SOCKET_EVENT_WARN,
                    `Select a user to send message to`
                );
                return;
            }

            if (!queueConnection) {
                queueConnection = await HandleAmqp.getInstance();
            }

            await queueConnection.pushMessage({
                to: data.to,
                from: userid,
                message: data.message,
                timestamp: new Date().toISOString(),
            });

            if (receiverid) {
                io.to(receiverid).emit(constants.SOCKET_EVENT_MESSAGE, {
                    from: userid,
                    to: data.to,
                    message: data.message,
                });
            }
            if (!receiverid) {
                socket.emit(
                    constants.SOCKET_EVENT_WARN,
                    `User is not online ${data.to}`
                );
            }
        });

        socket.on(constants.SOCKET_EVENT_DISCONNECT, async (reason) => {
            if ((await redis.get(userid)) === socket.id) {
                logger.debug(`Disconnected :: ${userid}`);
                await redis.del(userid);
            } else {
                logger.warn("Not deleting userid multiple tabs");
            }
        });
    });
}

export default configSocket;
