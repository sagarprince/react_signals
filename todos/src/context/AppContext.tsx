import { createContext } from "react";
import state from './AppState';

export const AppContext = createContext<any>(null);

export const AppContextProvider: React.FC<any> = ({ children }) => {
    return (
        <AppContext.Provider value={state}>
            {children}
        </AppContext.Provider>
    );
}