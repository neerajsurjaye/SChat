import { useState } from "react";
import SearchUsers from "./SearchUsers";
import UsersList from "./UsersList";

export default function ChatUsers(props: any) {
    let [activeUser, setActiveUser] = useState("");
    const setToUser = props.setToUser;

    return (
        <div className="chatUsers">
            <SearchUsers setActiveUser={setActiveUser}></SearchUsers>
            <UsersList
                activeUserState={[activeUser, setActiveUser]}
                setToUser={setToUser}
            ></UsersList>
        </div>
    );
}
