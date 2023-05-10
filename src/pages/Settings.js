import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { useAuthContext } from "../context/AuthContext";
import '../styles/settings/Settings.css'

const Settings = (props) => {
    const {setProfileUser} = props;
    const [currentPopUp, setCurrentPopUp] = useState();
    const { loggedIn, userData, userDoc } = useAuthContext();

    return (
        <div className="settings-wrapper">
            <Navbar setProfileUser={setProfileUser} setCurrentPopUp={setCurrentPopUp}/>
            <div className="settings-main">Settings</div>
            {currentPopUp}
        </div>
    );
};

export default Settings;