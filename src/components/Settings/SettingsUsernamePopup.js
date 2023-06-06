import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { firestore, auth } from "../../firebase";
import { doc, updateDoc, collection, getDocs, query } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const SettingsUsernamePopup = (props) => {
    const { setCurrentPopUp } = props;
    const { loggedIn, userData, userDoc } = useAuthContext();
    const [usernameInput, setUsernameInput] = useState(userDoc.username);
    const userRef = doc(firestore, 'users', userDoc.uid);

    const saveUsername = async (e) => {
        e.preventDefault();
        await updateDoc(userRef, {
            username: usernameInput,
        });

        updateProfile(auth.currentUser, {
            username: usernameInput,
        });

        setCurrentPopUp();
    };

    //Check if username is taken in Firestore
    async function checkUsernameTaken(e) {
        let username = e.target.value;
        setUsernameInput(e.target.value);
        console.log(username);
        const collectionRef = collection(firestore, 'users');
        const querySnapshot = await getDocs(query(collectionRef));
        let usernames = [];
        querySnapshot.forEach((doc) => usernames.push(doc.data().username));
        let taken = (usernames.indexOf(username) === -1) ? false : true;

        if (taken) {
            e.target.setCustomValidity("Username Taken");
            e.target.reportValidity();

        } else {
            e.target.setCustomValidity("");
        };
    };

    return (
        <div id='settings-menu-wrapper'>
            <div id="popup-backdrop" onClick={() => setCurrentPopUp()}></div>
            <div id="exit-button" onClick={() => setCurrentPopUp()}>x</div>
            <form className="username-div" onSubmit={(e) => saveUsername(e)}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username-input" name="username" placeholder={userDoc.username} maxLength="150" onKeyUp={(e) => checkUsernameTaken(e)} required></input>
                </div>
                <button type="submit">Done</button>
            </form>
        </div >
    );
};

export default SettingsUsernamePopup;