import { createContext } from "react";

export const AppContext = createContext<{
    isLoggedIn: boolean;
    setIsLoggedIn: any;
}>({ isLoggedIn: false, setIsLoggedIn: null });
