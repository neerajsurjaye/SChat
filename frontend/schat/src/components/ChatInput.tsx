import { useState, type Dispatch, type SetStateAction } from "react";
import "../css/chatInput.css";

function ChatInput(
    props: Readonly<{
        setUserMessage: Dispatch<
            SetStateAction<{
                message: string;
            }>
        >;
    }>
) {
    let [message, setMessage] = useState("");
    let setUserMessage = props.setUserMessage;

    return (
        <div className="chat-input">
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input"
            />
            <button
                onClick={() => {
                    setUserMessage({ message });
                    setMessage("");
                }}
                className="btn"
            >
                Send
            </button>
        </div>
    );
}

export default ChatInput;
