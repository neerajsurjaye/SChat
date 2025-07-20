import { Link } from "react-router";
import "../css/homePage.css";

export default function HomePage() {
    return (
        <div className="home-page">
            <div className="home-cont">
                <p>Welcome to SChat</p>
                <h1 className="banner">SChat</h1>

                <div className="flex-row">
                    <Link className="btn" to={"/auth"}>
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
