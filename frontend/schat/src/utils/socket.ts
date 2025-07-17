import { io } from "socket.io-client";
import { LOCAL_STORAGE_AUTH_TOKEN } from "./constants";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

console.log("Fetched from LC", localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN));

const socket = io(SOCKET_URL, {
    extraHeaders: {
        Authorization:
            "bearer " + localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN),
    },
});

// export default function initializeSocket() {
//     return io(SOCKET_URL, {
//         extraHeaders: {
//             Authorization:
//                 "bearer" + localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN),
//         },
//     });
// }

export default socket;
