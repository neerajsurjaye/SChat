import {
    useCallback,
    useContext,
    useEffect,
    useState,
    type FC,
    type ReactNode,
} from "react";
import { ChatContext } from "../context/ChatContext";
import { sendGetRequest } from "../utils/network";
import {
    LOCAL_STORAGE_AUTH_TOKEN,
    MESSAGE_TYPE_RECEIVED,
    MESSAGE_TYPE_SEND,
} from "../utils/constants";
import Message from "./Message";

export default function OldMessages() {
    const { toUser } = useContext(ChatContext);

    let [messageComp, setMessageComp] = useState<ReactNode[]>([]);

    let fetchUserMessages = useCallback(async () => {
        let userMessages = await sendGetRequest(`/v1/message?to=${toUser}`, {
            headers: {
                Authorization:
                    "bearer " + localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN),
            },
        });

        if (!userMessages.success) {
            return;
        }

        console.log({ oldMessages: userMessages.data });

        setMessageComp(
            userMessages?.data?.map((msg: any) => {
                console.log(msg);

                return (
                    <Message
                        message={msg.message}
                        type={
                            msg.to == toUser
                                ? MESSAGE_TYPE_SEND
                                : MESSAGE_TYPE_RECEIVED
                        }
                        iat={msg.createdAt}
                        key={msg.createdAt}
                    ></Message>
                );
            })
        );
    }, [toUser]);

    useEffect(() => {
        fetchUserMessages();
    }, [fetchUserMessages]);

    return <>{messageComp}</>;
}
