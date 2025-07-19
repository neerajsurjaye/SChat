import { MESSAGE_TYPE_RECEIVED, MESSAGE_TYPE_SEND } from "../utils/constants";

export default function Message(
    props: Readonly<{
        message: string;
        type: string;
        iat: any;
    }>
) {
    let compClass = "message-single";

    if (props.type == MESSAGE_TYPE_SEND) {
        compClass += " message-sent";
    } else if (props.type == MESSAGE_TYPE_RECEIVED) {
        compClass += " message-received";
    }

    return (
        <div className={compClass} key={props.iat}>
            <div className="message-content">{props.message}</div>
            <div className="message-iat">{props.iat}</div>
        </div>
    );
}
