import { useState } from "react";
import Chat from "../components/Chat";
import ChatUsers from "../components/ChatUsers";
import { ChatContext } from "../context/ChatContext";

export default function ChatPage() {
    let [toUser, setToUser] = useState("");

    return (
        <ChatContext
            value={{
                toUser: toUser,
                setToUser: setToUser,
            }}
        >
            <div>ToUser : {toUser}</div>
            <Chat key={toUser} toUser={toUser}></Chat>
            <ChatUsers></ChatUsers>
        </ChatContext>
    );
}
