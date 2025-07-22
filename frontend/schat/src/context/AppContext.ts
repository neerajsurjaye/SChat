import { createContext, type Dispatch, type SetStateAction } from "react";

export const AppContext = createContext<{
    isLoggedIn: boolean;
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}>({ isLoggedIn: false, setIsLoggedIn: () => {} });
