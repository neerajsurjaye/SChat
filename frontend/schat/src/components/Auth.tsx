import { useState } from "react";
import { sendPostRequest } from "../utils/network";
import { LOCAL_STORAGE_AUTH_TOKEN } from "../utils/constants";

async function login(userDetails: any) {
    let resp = await sendPostRequest("v1/user/login", userDetails);
    console.log("RespData", resp);

    if (resp.success) {
        localStorage.setItem(LOCAL_STORAGE_AUTH_TOKEN, resp.data);
    }
}

async function signUp(signUp: any) {}

export default function Auth() {
    let [userDetails, setUserDetails] = useState({
        username: "",
        password: "",
    });

    return (
        <div className="auth-component">
            <div className="modal"></div>

            <div className="input-container">
                <span>Username : </span>
                <input
                    type="text"
                    className="username"
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
                <span>Passowrd : </span>
                <input
                    type="text"
                    className="password"
                    value={userDetails.password}
                    onChange={(e) => {
                        setUserDetails({
                            ...userDetails,
                            password: e.target.value,
                        });
                    }}
                />
            </div>

            <button
                className="btn"
                onClick={() => {
                    login(userDetails);
                }}
            >
                Login
            </button>
            <button
                className="btn"
                onClick={() => {
                    signUp(userDetails);
                }}
            >
                Register
            </button>
        </div>
    );
}
