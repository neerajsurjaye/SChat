import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import { AppContext } from "./context/AppContext";
import { LOCAL_STORAGE_AUTH_TOKEN } from "./utils/constants";
import Footer from "./components/footer";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN) != null
    );

    return (
        <BrowserRouter>
            <AppContext value={{ isLoggedIn, setIsLoggedIn }}>
                <Navbar></Navbar>
                <Routes>
                    <Route path="/" Component={HomePage}></Route>
                    <Route path={"auth"} Component={AuthPage}></Route>
                    <Route path={"chat"} Component={ChatPage}></Route>
                </Routes>
            </AppContext>
            <Footer></Footer>
        </BrowserRouter>
    );
}

export default App;
