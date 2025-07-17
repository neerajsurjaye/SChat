import { useState } from "react";
import Chat from "../components/Chat";

export default function ChatPage() {
    let [toUser, setToUser] = useState("");

    return (
        <>
            <Chat key={toUser} toUser={toUser}></Chat>
            <input
                type="text"
                value={toUser}
                onChange={(e) => {
                    setToUser(e.target.value);
                }}
            />
        </>
    );
}
