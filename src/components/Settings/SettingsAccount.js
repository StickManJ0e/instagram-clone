import React, { useEffect, useState } from "react";
import SettingsUsernamePopup from "./SettingsUsernamePopup";

const SettingsAccount = (props) => {
    const { setCurrentPopUp, currentPopUp } = props;

    return (
        <div className="settings-content account">
            <div>Account Settings</div>
            <div className="settings-button" onClick={() => setCurrentPopUp(<SettingsUsernamePopup setCurrentPopUp={setCurrentPopUp} />)}>Username</div>
        </div>
    );
};

export default SettingsAccount;