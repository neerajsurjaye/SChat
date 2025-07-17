import { useState } from "react";
import Auth from "./components/Auth";
import Chat from "./components/Chat";
import { BrowserRouter, Route, Routes } from "react-router";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";

function App() {
    let [toUser, setToUser] = useState("");

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" Component={HomePage}></Route>
                <Route path={"auth"} Component={AuthPage}></Route>
                <Route path={"chat"} Component={ChatPage}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
