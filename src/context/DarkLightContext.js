import React, { useState, useEffect, createContext, useContext } from "react";

let DarkLightContext = createContext({
    themeMode: undefined,
    setThemeMode: undefined,
})

const DarkLightProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState('light');

    useEffect(() => {
        if (themeMode === 'dark') {
            document.documentElement.style.setProperty('--mode-background-color', 'rgb(0, 0, 0)');
            document.documentElement.style.setProperty('--mode-text-color', 'rgb(255, 255, 255)');
            document.documentElement.style.setProperty('--mode-background-color-hover', 'rgba(255, 255, 255, 0.1)');
            document.documentElement.style.setProperty('--mode-background-color-higlight', 'rgb(15, 15, 15)');
        } else {
            document.documentElement.style.setProperty('--mode-background-color', 'rgb(255, 255, 255)');
            document.documentElement.style.setProperty('--mode-text-color', 'rgb(0, 0, 0)');
            document.documentElement.style.setProperty('--mode-background-color-hover', 'rgba(0, 0,0, 0.05)');
            document.documentElement.style.setProperty('--mode-background-color-higlight', 'rgb(245, 245, 245)');
        };
    }, [themeMode]);

    return (
        <DarkLightContext.Provider value={{themeMode, setThemeMode}}>
        { children }
        </DarkLightContext.Provider >
    );
};

const useDarkLightContext = () => useContext(DarkLightContext);

export {useDarkLightContext, DarkLightProvider};