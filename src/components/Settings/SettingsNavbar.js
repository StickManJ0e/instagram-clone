import React from "react";
import { useNavigate } from "react-router-dom";

const SettingsNavbar = () => {
    let navigate = useNavigate();

    const navigateSettings = (path) => {
        navigate(path)
    };

    return (
        <div id="settings-navbar">
            <div onClick={() => navigateSettings('/settings/edit')}>Edit Profile</div>
            <div onClick={() => navigateSettings('/settings/account')}>Account Settings</div>
        </div>
    );
};

export default SettingsNavbar;