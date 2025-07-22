import { useContext, useState } from "react";
import { sendPostRequest } from "../utils/network";
import {
    LOCAL_STORAGE_AUTH_TOKEN,
    MODAL_TYPE_ERROR,
    MODAL_TYPE_SUCCESS,
} from "../utils/constants";
import SocketHandler from "../utils/socket";
import Modal from "./Modal";
import "../css/auth.css";
import { AppContext } from "../context/AppContext";

export default function Auth() {
    const { setIsLoggedIn } = useContext(AppContext);

    let [userDetails, setUserDetails] = useState({
        username: "",
        password: "",
    });

    let [modalState, setModalState] = useState<{
        type: string;
        message: string;
    }>({ type: "", message: "" });

    async function login(userDetails: { username: string; password: string }) {
        let resp = await sendPostRequest("/auth/v1/user/login", userDetails);

        if (resp.success) {
            localStorage.setItem(LOCAL_STORAGE_AUTH_TOKEN, resp.data);
            SocketHandler.reCreateSocket();
            setModalState({
                type: MODAL_TYPE_SUCCESS,
                message: "Successfully logged in",
            });
            setIsLoggedIn(true);
        } else {
            setModalState({
                type: MODAL_TYPE_ERROR,
                message: resp.message,
            });
        }
    }

    async function signUp(userDetails: { username: string; password: string }) {
        let resp = await sendPostRequest("/auth/v1/user/", userDetails);

        if (resp.success) {
            localStorage.setItem(LOCAL_STORAGE_AUTH_TOKEN, resp.data);
            SocketHandler.reCreateSocket();
            setModalState({
                type: MODAL_TYPE_SUCCESS,
                message: "User registered successfully! Please sign in!",
            });
        } else {
            setModalState({
                type: MODAL_TYPE_ERROR,
                message: resp.message,
            });
        }
    }

    return (
        <div className="auth-component">
            <div className="input-container">
                <span>Username </span>
                <input
                    type="text"
                    className="username input"
                    value={userDetails.username}
                    onChange={(e) =>
                        setUserDetails({
                            ...userDetails,
                            username: e.target.value,
                        })
                    }
                />
            </div>

            <div className="input-container">
                <span>Passowrd </span>
                <input
                    type="text"
                    className="password input"
                    value={userDetails.password}
                    onChange={(e) => {
                        setUserDetails({
                            ...userDetails,
                            password: e.target.value,
                        });
                    }}
                />
            </div>

            <div className="flex-row">
                <button className="btn" onClick={() => login(userDetails)}>
                    Login
                </button>
                <button className="btn" onClick={() => signUp(userDetails)}>
                    Register
                </button>
            </div>

            <Modal type={modalState.type} message={modalState.message}></Modal>
        </div>
    );
}
