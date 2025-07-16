import { useEffect, useState } from "react";
import { MESSAGE_TYPE_RECEIVED, MESSAGE_TYPE_SEND } from "../utils/constants";
import "../css/chatMessage.css";

function generateMessageComp(message: any) {
    let compClass = "message-single";

    if (message.type == MESSAGE_TYPE_SEND) {
        compClass += " message-sent";
    } else if (message.type == MESSAGE_TYPE_RECEIVED) {
        compClass += " message-received";
    }

    let comp = (
        <div className={compClass} key={message.iat}>
            <div className="message-content">{message.message}</div>
            <div className="message-iat">{message.iat}</div>
        </div>
    );

    return comp;
}

function ChatMessages(props: any) {
    let message = props.message;
    let [messageComp, setMessageComp] = useState<any[]>([]);

    useEffect(() => {
        if (message && message != "") {
            setMessageComp([...messageComp, generateMessageComp(message)]);
            console.log({ messageComp, message });
        }
    }, [message]);

    return <div className="chat-message">{messageComp}</div>;
}

export default ChatMessages;
