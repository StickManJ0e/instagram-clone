import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { auth, firestore } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { query, onSnapshot, doc, getDoc } from "firebase/firestore";

let AuthContext = createContext({
    loggedIn: false,
    userData: undefined,
    userDoc: undefined,
})

const AuthContextProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState();
    const [userDoc, setUserDoc] = useState();

    const queryListener = (userRef) => {
        onSnapshot(query(userRef), (snapshot) => {
            setUserDoc(snapshot.data());
        });
    }

    const getUserDoc = async (userRef) => {
        queryListener(userRef);
        const docSnap = await getDoc(query(userRef));
        let postUser = docSnap.data();
        setUserDoc(postUser);
        queryListener(userRef);
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = doc(firestore, 'users', user.uid);
                queryListener(userRef);
                setLoggedIn(true);
                setUserData(user);
                getUserDoc(userRef);
            } else {
                setLoggedIn(false);
            }
        })
    }, []);

    return (
        <AuthContext.Provider value={{ loggedIn, userData, userDoc }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuthContext = () => useContext(AuthContext);

export { useAuthContext, AuthContextProvider }