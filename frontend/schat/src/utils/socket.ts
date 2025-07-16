import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const socket = io(SOCKET_URL, {
    extraHeaders: {
        Authorization:
            "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5lZXJhaiIsImlhdCI6MTc1MjY4MzEzM30.e1NQLgMdj61HfjOvBi5az2cCNrSrkPN2laZss8m_bOg",
    },
});

export default socket;
