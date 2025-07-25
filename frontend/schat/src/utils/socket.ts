import { io, Socket } from "socket.io-client";
import { LOCAL_STORAGE_AUTH_TOKEN } from "./constants";

const SOCKET_URL = import.meta.env.VITE_GATEWAY_BASE_URL;

console.log("Fetched from LC", localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN));

// const socket = io(SOCKET_URL, {
//     extraHeaders: {
//         Authorization:
//             "bearer " + localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN),
//     },
// });

class SocketHandler {
    private static socket: Socket;

    private static init() {
        if (this.socket) {
            this.socket.disconnect();
        }

        this.socket = io(SOCKET_URL, {
            path: "/chat/",
            extraHeaders: {
                Authorization:
                    "bearer " + localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN),
            },
        });

        this.socket.on("error", (err) => {
            console.log("Socket Error :: ", err);
        });
    }

    public static getSocket() {
        if (!this.socket) {
            this.init();
        }
        return this.socket;
    }

    public static reCreateSocket() {
        if (this.socket) {
            this.socket.disconnect();
        }
        this.init();
    }
}

// export default function initializeSocket() {
//     return io(SOCKET_URL, {
//         extraHeaders: {
//             Authorization:
//                 "bearer" + localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN),
//         },
//     });
// }

export default SocketHandler;
