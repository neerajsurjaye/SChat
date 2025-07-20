import { use, useCallback, useContext, useEffect, useState } from "react";
import { sendGetRequest } from "../utils/network";
import { generateUrl } from "../utils/url";
import { ChatContext } from "../context/ChatContext";
import "../css/searchUsers.css";

export default function SearchUsers(props: any) {
    let [username, setUsername] = useState("");
    let [searchedUsers, setSearchedUsers] = useState<string[]>([]);
    let { setToUser } = useContext(ChatContext);

    let searchUser = useCallback(async () => {
        if (username == "") {
            setSearchedUsers([]);
            return;
        }

        const resp = await sendGetRequest(
            generateUrl(`/v1/user/search?username=${username}`)
        );
        if (resp.success) {
            let data = resp.data;
            setSearchedUsers(data);
        }
    }, [username]);

    let genUserList = () => {
        return searchedUsers.map((user) => (
            <button
                onClick={() => {
                    setToUser(user);
                }}
                key={user}
                className="btn btn-small"
            >
                {user}
            </button>
        ));
    };

    useEffect(() => {
        searchUser();
    }, [searchUser]);

    return (
        <div className="search-users">
            <div className="input-container">
                <span>Search Users</span>
                <input
                    className="input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="user-list">{genUserList()}</div>
        </div>
    );
}
