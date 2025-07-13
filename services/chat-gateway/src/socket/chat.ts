import dotenv from "dotenv";
import { DefaultEventsMap, Server, Socket } from "socket.io";
import logger from "../utils/logger.js";
import commonUtils from "../utils/commonUtils.js";
import constants from "../utils/constants.js";

dotenv.config({ path: ".env" });

const AUTH_URL = process.env.AUTH_URL;

commonUtils.checkEnv({ AUTH_URL });

function configSocket(
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
    const users = {};

    io.use(async (socket, next) => {
        const rawToken = socket.handshake.headers.authorization;

        if (!rawToken) {
            return next(new Error("Authentication Error! No Token"));
        }

        //No need to split send the RAW token with bearer <token>
        // const token = String(rawToken).split(" ")[1];
        // if (!token) {
        //     return next(new Error("Authentication Error! No Token"));
        // }

        //auth token verification from auth service
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

    io.on("connection", (socket: Socket) => {
        const userid: string = String(socket.data.user);
        users[userid] = socket.id;

        socket.emit(
            constants.SOCKET_EVENT_STATUS,
            `Connected!! Welcome user : ${socket.data?.user}`
        );

        socket.on(constants.SOCKET_EVENT_MESSAGE, (data) => {
            const receiverid = users[data.to];

            if (receiverid) {
                io.to(receiverid).emit(
                    constants.SOCKET_EVENT_MESSAGE,
                    data.message
                );
            }
            if (!receiverid) {
                socket.emit(
                    constants.SOCKET_EVENT_WARN,
                    `User is not online ${data.to}`
                );
            }
        });

        socket.on(constants.SOCKET_EVENT_DISCONNECT, (reason) => {
            if (users[userid] === socket.id) {
                logger.debug(`Disconnected :: ${userid}`);
                delete users[userid];
            } else {
                logger.warn("Not deleting userid multiple tabs");
            }
        });
    });
}

export default configSocket;
