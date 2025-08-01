import { useCallback, useContext, useEffect, useState, type JSX } from "react";
import SocketHandler from "../utils/socket";
import { ChatContext } from "../context/ChatContext";
import "../css/userList.css";

export default function UsersList() {
    const socket = SocketHandler.getSocket();
    let { toUser, setToUser } = useContext(ChatContext);
    const [users, setUsers] = useState<
        { username: string; messages: number }[]
    >([]);

    const createUserList = () => {
        let userCompList: JSX.Element[] = [];
        for (let idx in users) {
            userCompList.push(
                <button
                    className="btn btn-wide user-list-comp"
                    onClick={() => {
                        setToUser(users[idx].username);
                    }}
                    key={users[idx].username}
                >
                    <div className="username">{users[idx].username}</div>
                    <div className="messages">{users[idx].messages}</div>
                </button>
            );
        }
        return userCompList;
    };

    const handleMessage = useCallback(
        (msg: { from: string; to: string; message: string }) => {
            if (!msg.from || !msg.to || !msg.message) {
                return;
            }
            if (msg.from != toUser) {
                setUsers((oldUsers) => {
                    console.log("userUpdated");

                    let newUsers = [...oldUsers];
                    let userUpdated = false;

                    for (let x in newUsers) {
                        if (newUsers[x].username == msg.from) {
                            newUsers[x].messages += 1;
                            userUpdated = true;
                            break;
                        }
                    }

                    if (!userUpdated) {
                        newUsers.push({ username: msg.from, messages: 1 });
                    }
                    return newUsers;
                });
            }
        },
        []
    );

    useEffect(() => {
        socket.on("message", handleMessage);

        return () => {
            socket.removeListener("message", handleMessage);
        };
    }, [handleMessage]);

    return <div className="chat-users-list">{createUserList()}</div>;
}
