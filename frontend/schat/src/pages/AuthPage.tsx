import { useContext } from "react";
import Auth from "../components/Auth";
import { AppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import { MODAL_TYPE_SUCCESS, MODAL_TYPE_WARN } from "../utils/constants";

export default function AuthPage() {
    const { isLoggedIn } = useContext(AppContext);

    return (
        <div className="page home-page">
            {isLoggedIn ? (
                <Modal type={MODAL_TYPE_SUCCESS} message={"Logged in"}></Modal>
            ) : (
                <Auth></Auth>
            )}
        </div>
    );
}
