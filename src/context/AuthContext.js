import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, firestore } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, query } from "firebase/firestore";

let AuthContext = createContext({
    loggedIn: false,
    userData: undefined,
    userDoc: undefined,
})

const AuthContextProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState();
    const [userDoc, setUserDoc] = useState();

    const getUserDoc = async (uid) => {
        const userRef = doc(firestore, 'users', uid);
        const docSnap = await getDoc(query(userRef));
        let postUser = {
            displayName: docSnap.data().displayName,
            email: docSnap.data().email,
            photoUrl: docSnap.data().photoUrl,
            timestamp: docSnap.data().timestamp,
            uid: docSnap.data().uid,
            username: docSnap.data().username,
        };
        setUserDoc(postUser);
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedIn(true);
                setUserData(user);
                getUserDoc(user.uid);

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