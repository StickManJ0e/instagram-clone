import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import '../styles/settings/Settings.css'
import SettingsEdit from "../components/Settings/SettingsEdit";
import SettingsAccount from "../components/Settings/SettingsAccount";
import SettingsNavbar from "../components/Settings/SettingsNavbar";

const Settings = (props) => {
    const { setProfileUser, menu, currentPopUp, setCurrentPopUp } = props;
    const [currentMenu, setCurrentMenu] = useState();

    useEffect(() => {
        setCurrentMenu(menu);
    }, [menu])

    return (
        <div className="settings-wrapper">
            {currentPopUp}
            <Navbar setProfileUser={setProfileUser} setCurrentPopUp={setCurrentPopUp} />
            <div className="settings-main">
                <div className="settings-header">Settings</div>
                <div className="settings-menu">
                    <SettingsNavbar />
                    {(currentMenu === 'edit') ? <SettingsEdit /> : (currentMenu === 'account') ? <SettingsAccount currentPopUp={currentPopUp} setCurrentPopUp={setCurrentPopUp} /> :
                        ''}
                </div>
            </div>
            {currentPopUp}
        </div>
    );
};

export default Settings;