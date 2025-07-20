import { useState } from "react";
import Chat from "../components/Chat";
import ChatUsers from "../components/ChatUsers";
import { ChatContext } from "../context/ChatContext";
import "../css/chatpage.css";

export default function ChatPage() {
    let [toUser, setToUser] = useState("");

    return (
        <div className="chat-page">
            <ChatContext
                value={{
                    toUser: toUser,
                    setToUser: setToUser,
                }}
            >
                {/* <div>ToUser : {toUser}</div> */}
                <ChatUsers></ChatUsers>

                <Chat key={toUser} toUser={toUser}></Chat>
            </ChatContext>
        </div>
    );
}
