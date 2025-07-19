import { useEffect, useState } from "react";
import "../css/chatMessage.css";
import Message from "./Message";
import OldMessages from "./OldMessages";

function generateMessageComp(message: any) {
    return (
        <Message
            message={message.message}
            type={message.type}
            iat={message.iat}
        ></Message>
    );
}

function ChatMessages(
    props: Readonly<{
        message:
            | {
                  type: string;
                  message: string;
                  iat: any;
              }
            | undefined;
    }>
) {
    let message = props?.message;
    let [messageComp, setMessageComp] = useState<any[]>([]);

    useEffect(() => {
        if (message && message.message != "") {
            setMessageComp([...messageComp, generateMessageComp(message)]);
            console.log({ messageComp, message });
        }
    }, [message]);

    return <div className="new-chat-messages">{messageComp}</div>;
}

export default ChatMessages;
