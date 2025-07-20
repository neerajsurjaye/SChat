import { Link } from "react-router";
import "../css/navBar.css";

export default function Navbar() {
    return (
        <div className="nav-bar flex-row">
            <Link className="no-link" to={"/"}>
                <h2>SChat</h2>
            </Link>

            <Link className="mr-lft-auto btn nav-btn" to={"/chat"}>
                Chat
            </Link>

            <Link className="btn nav-btn" to={"/auth"}>
                SignIn
            </Link>
        </div>
    );
}
