import Chat from "./components/Chat";
import socket from "./utils/socket";

function App() {
    // socket.emit("message", {
    //     to: "neeraj",
    //     message: "A custom message from frontend",
    // });
    return <Chat toUser={"admin"}></Chat>;
}

export default App;
