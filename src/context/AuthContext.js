import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, firestore } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";

let AuthContext = createContext({
    loggedIn: false,
    userData: undefined,
})

const AuthContextProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedIn(true);
                setUserData(user);
            } else {
                setLoggedIn(false);
            }
        })
    }, []);

    return (
        <AuthContext.Provider value={{ loggedIn, userData }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuthContext = () => useContext(AuthContext);

export {useAuthContext, AuthContextProvider}