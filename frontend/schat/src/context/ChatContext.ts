import { createContext, type Dispatch, type SetStateAction } from "react";

export const ChatContext = createContext<{
    toUser: string;
    setToUser: Dispatch<SetStateAction<string>>;
}>({ toUser: "", setToUser: () => {} });
