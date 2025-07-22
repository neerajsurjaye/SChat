import { useContext, useState } from "react";
import Chat from "../components/Chat";
import ChatUsers from "../components/ChatUsers";
import { ChatContext } from "../context/ChatContext";
import "../css/chatpage.css";
import { AppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import { MODAL_TYPE_WARN } from "../utils/constants";

export default function ChatPage() {
    let [toUser, setToUser] = useState("");
    const { isLoggedIn } = useContext(AppContext);

    return isLoggedIn ? (
        <ChatContext
            value={{
                toUser: toUser,
                setToUser: setToUser,
            }}
        >
            <div className="chat-page">
                <ChatUsers></ChatUsers>
                <Chat></Chat>
            </div>
        </ChatContext>
    ) : (
        <div className="page">
            <Modal
                type={MODAL_TYPE_WARN}
                message={"Please login to Continue"}
            ></Modal>
        </div>
    );
}
