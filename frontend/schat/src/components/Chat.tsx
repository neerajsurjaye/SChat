import { useCallback, useContext, useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import {
    MESSAGE_TYPE_RECEIVED,
    MESSAGE_TYPE_SEND,
    MODAL_TYPE_WARN,
} from "../utils/constants";

import SocketHandler from "../utils/socket";
import OldMessages from "./OldMessages";

import "../css/chat.css";
import { ChatContext } from "../context/ChatContext";
import Modal from "./Modal";

function Chat() {
    let [userMessage, setUserMessage] = useState<{ message: string }>({
        message: "",
    });
    let [receivedMessage, setReceivedMessage] = useState<{ message: string }>({
        message: "",
    });

    let [message, setMessage] = useState<{
        type: string;
        message: string;
        iat: any;
    }>();

    let chatMessageRef = useRef<HTMLDivElement>(null);

    let { toUser } = useContext(ChatContext);

    let socket = SocketHandler.getSocket();

    const handleMessage = useCallback(
        (msg: { from: string; to: string; message: string }) => {
            if (!msg.from || !msg.to || !msg.message) {
                return;
            }
            if (msg.from == toUser) {
                setReceivedMessage({ message: msg.message });
            } else {
                console.error(
                    "Message from external user :: ",
                    msg.from,
                    "Current to user",
                    toUser
                );
            }
        },
        [toUser]
    );

    useEffect(() => {
        socket.on("message", handleMessage);

        return () => {
            socket.removeListener("message", handleMessage);
        };
    }, [handleMessage]);

    useEffect(() => {
        if (userMessage.message != "") {
            socket.emit("message", {
                to: toUser,
                message: userMessage.message,
            });

            setMessage({
                type: MESSAGE_TYPE_SEND,
                message: userMessage.message,
                iat: Date.now(),
            });
            setUserMessage({ message: "" });
        }
    }, [userMessage]);

    useEffect(() => {
        if (receivedMessage.message != "") {
            setMessage({
                type: MESSAGE_TYPE_RECEIVED,
                message: receivedMessage.message,
                iat: Date.now(),
            });
        }
    }, [receivedMessage]);

    useEffect(() => {
        setTimeout(() => {
            if (chatMessageRef.current) {
                chatMessageRef.current.scrollTop =
                    chatMessageRef.current.scrollHeight;
            }
        }, 100);
    }, [userMessage, toUser]);

    return !toUser || toUser == "" ? (
        <div className="chat">
            <Modal
                type={MODAL_TYPE_WARN}
                message={"Choose a user to send message to"}
            ></Modal>
        </div>
    ) : (
        <div className="chat">
            <div className="receiver">{toUser}</div>
            <div className="chat-messages" ref={chatMessageRef}>
                <OldMessages></OldMessages>
                <ChatMessages message={message}></ChatMessages>
            </div>
            <ChatInput setUserMessage={setUserMessage}></ChatInput>
        </div>
    );
}

export default Chat;
