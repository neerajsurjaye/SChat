import { Link } from "react-router";

export default function HomePage() {
    return (
        <div>
            <Link to={"/auth"}>Auth</Link>
            <br></br>
            <Link to={"/chat"}>Chat</Link>
        </div>
    );
}
