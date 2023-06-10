import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";

const SettingsPasswordPopup = (props) => {
    const { setCurrentPopUp } = props;
    const [passwordValid, setPasswordValid] = useState();

    const checkPassword = async (e) => {
        e.preventDefault();
        try {
            const oldPassword = e.target.oldPassword.value;
            const newPassword = e.target.newPassword.value;
            const credential = EmailAuthProvider.credential(auth.currentUser.email, oldPassword);

            await reauthenticateWithCredential(auth.currentUser, credential);
            setPasswordValid(true);
            await updatePassword(auth.currentUser, newPassword);
            console.log('updated');
            setCurrentPopUp();
        } catch (error) {
            if (error.message === 'Firebase: Error (auth/wrong-password).') {
                setPasswordValid(false);
            };
        };
    };

    //Check if inputs in password and confirm password areas are same
    const confirmPassword = (e) => {
        let confirmPasswordVal = e.target.value;
        let passwordVal = e.target.parentElement.parentElement.newPassword.value;
        if (confirmPasswordVal === passwordVal) {
            e.target.setCustomValidity("");

        } else {
            e.target.setCustomValidity("Passwords Not Matching");
            e.target.reportValidity();
        };
    };

    return (
        <div id='settings-menu-wrapper'>
            <div id="popup-backdrop" onClick={() => setCurrentPopUp()}></div>
            <div id="exit-button" onClick={() => setCurrentPopUp()}>x</div>
            <form className="username-div" onSubmit={(e) => checkPassword(e)}>
                <div>
                    <label htmlFor="oldPassword">Password</label>
                    <input className="old-password-input" type="password" name="oldPassword" required></input>
                    {passwordValid === false ?
                        <div>Your old password has been entered incorrectly. Please enter it again.</div> :
                        ''}
                </div>
                <div>
                    <label htmlFor="newPassword">New password</label>
                    <input className="new-password" type="password" name="newPassword" required></input>
                </div>
                <div>
                    <label htmlFor="confirmNewPassword">Confirm new password</label>
                    <input className="confirm=new-password" type="password" name="confirmNewPassword" onKeyUp={(e) => confirmPassword(e)} required></input>
                </div>
                <button type="submit">Done</button>
            </form>
        </div >
    )
}

export default SettingsPasswordPopup;