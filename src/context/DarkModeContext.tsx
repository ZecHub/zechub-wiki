import React from "react";

type DarkModeContextValue ={
    dark: boolean;
    setDark: React.Dispatch<React.SetStateAction<boolean>>
}


export const DarkModeContext = React.createContext<DarkModeContextValue | undefined>(undefined)
