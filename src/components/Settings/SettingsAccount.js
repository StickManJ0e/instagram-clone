import React, { useEffect, useState } from "react";
import SettingsUsernamePopup from "./SettingsUsernamePopup";
import SettingsPasswordPopup from "./SettingsPasswordPopup";
import { auth } from "../../firebase";

const SettingsAccount = (props) => {
    const { setCurrentPopUp } = props;
    const [providerIsPasswords, setProviderIsPassword] = useState(false);

    const checkIsPasswords = () => {
        if (auth.currentUser.providerData[0].providerId === 'password') {
            setProviderIsPassword(true);
        }
    }

    useEffect(() => {
        checkIsPasswords();
    }, [])

    return (
        <div className="settings-content account">
            <div>Account Settings</div>
            <div className="settings-button" onClick={() => setCurrentPopUp(<SettingsUsernamePopup setCurrentPopUp={setCurrentPopUp} />)}>Username</div>
            {providerIsPasswords ?
                <div className="seetings-button" onClick={() => setCurrentPopUp(<SettingsPasswordPopup setCurrentPopUp={setCurrentPopUp} />)}>Reset password</div> :
                ''}
        </div>
    );
};

export default SettingsAccount;