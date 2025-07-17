import { useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import { MESSAGE_TYPE_RECEIVED, MESSAGE_TYPE_SEND } from "../utils/constants";
import initializeSocket from "../utils/socket";
import socket from "../utils/socket";

function Chat(props: any) {
    let [userMessage, setUserMessage] = useState<{ message: string }>({
        message: "",
    });
    let [receivedMessage, setReceivedMessage] = useState<{ message: string }>({
        message: "",
    });

    let [message, setMessage] = useState<any>();
    let toUser = props.toUser;

    // const socket = initializeSocket();

    useEffect(() => {
        socket.on("message", (msg) => {
            console.log("OnMessage ", { msg, toUser: props.toUser });

            if (!msg.from || !msg.to || !msg.message) {
                return;
            }
            if (msg.from == props.toUser) {
                setReceivedMessage({ message: msg.message });
            } else {
                console.log(
                    "Message from external user :: ",
                    msg.from,
                    "Current to user",
                    props.toUser
                );
            }
        });

        return () => {
            socket.removeListener("message");
        };
    }, [props.toUser]);

    useEffect(() => {
        console.log("Input Changed :: ", { userMessage });

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

    return (
        <div className="chat">
            <ChatMessages message={message}></ChatMessages>
            <ChatInput setUserMessage={setUserMessage}></ChatInput>
        </div>
    );
}

export default Chat;
