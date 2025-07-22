import { useEffect, useState, type JSX } from "react";
import "../css/chatMessage.css";
import Message from "./Message";

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
    let [messageComp, setMessageComp] = useState<JSX.Element[]>([]);

    function generateMessageComp(message: {
        message: string;
        type: string;
        iat: any;
    }) {
        return (
            <Message
                message={message.message}
                type={message.type}
                iat={message.iat}
                key={message.iat}
            ></Message>
        );
    }

    useEffect(() => {
        if (message && message.message != "") {
            setMessageComp([...messageComp, generateMessageComp(message)]);
        }
    }, [message]);

    return <>{messageComp}</>;
}

export default ChatMessages;
