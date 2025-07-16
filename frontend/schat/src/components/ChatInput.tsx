import { useState } from "react";

function ChatInput(props: any) {
    let [message, setMessage] = useState("");
    let setUserMessage = props.setUserMessage;

    return (
        <div className="input">
            <input
                value={message}
                onChange={(e) => {
                    setMessage(e.target.value);
                }}
            />
            <button
                onClick={() => {
                    setUserMessage({ message });
                    setMessage("");
                }}
            >
                Send
            </button>
        </div>
    );
}

export default ChatInput;
