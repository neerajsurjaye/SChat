import SearchUsers from "./SearchUsers";
import UsersList from "./UsersList";
import "../css/chatusers.css";

export default function ChatUsers() {
    return (
        <div className="chat-users">
            <SearchUsers></SearchUsers>
            <UsersList></UsersList>
        </div>
    );
}
