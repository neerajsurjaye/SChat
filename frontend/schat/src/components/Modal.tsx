import "../css/modal.css";

export default function Modal(
    props: Readonly<{ type: string; message: string }>
) {
    return <div className={`modal ${props.type}`}>{props.message}</div>;
}
