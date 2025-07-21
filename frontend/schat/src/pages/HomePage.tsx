import { Link } from "react-router";
import "../css/homePage.css";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function HomePage() {
    const { isLoggedIn } = useContext(AppContext);

    return (
        <div className="page home-page">
            <div className="home-cont">
                <p>Welcome to</p>
                <h1 className="banner">SChat</h1>

                <div className="flex-row">
                    <Link
                        className={`btn ${isLoggedIn ? "display-none" : ""}`}
                        to={"/auth"}
                    >
                        Login
                    </Link>
                    <Link className="btn" to={"/chat"}>
                        Chat with other users
                    </Link>
                </div>
            </div>
        </div>
    );
}
