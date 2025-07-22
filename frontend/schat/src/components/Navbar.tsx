import { Link } from "react-router";
import "../css/navBar.css";
import { LOCAL_STORAGE_AUTH_TOKEN } from "../utils/constants";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import SocketHandler from "../utils/socket";

export default function Navbar() {
    const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);

    const signOut = () => {
        localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN);
        setIsLoggedIn(false);
        SocketHandler.getSocket().disconnect();
    };

    return (
        <div className="nav-bar flex-row">
            <Link className="no-link" to={"/"}>
                <h2>SChat</h2>
            </Link>

            <Link className="mr-lft-auto btn nav-btn" to={"/chat"}>
                Chat
            </Link>

            {isLoggedIn ? (
                <button className="btn nav-btn" onClick={signOut}>
                    Sign Out
                </button>
            ) : (
                <Link className="btn nav-btn" to={"/auth"}>
                    Log in
                </Link>
            )}
        </div>
    );
}
