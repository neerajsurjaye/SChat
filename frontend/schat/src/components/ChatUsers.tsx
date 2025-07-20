import { useState } from "react";
import SearchUsers from "./SearchUsers";
import UsersList from "./UsersList";
import "../css/chatusers.css";

export default function ChatUsers(props: any) {
    let [activeUser, setActiveUser] = useState("");
    const setToUser = props.setToUser;

    return (
        <div className="chat-users">
            <SearchUsers setActiveUser={setActiveUser}></SearchUsers>
            <UsersList
                activeUserState={[activeUser, setActiveUser]}
                setToUser={setToUser}
            ></UsersList>
        </div>
    );
}
