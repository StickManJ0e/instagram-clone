import React from "react";
import { useDarkLightContext } from "../../context/DarkLightContext";

const NavbarMoreMenu = (props) => {
    const { setNavbarMorePopup } = props;
    const { themeMode, setThemeMode } = useDarkLightContext();

    const toggleLightDarkMode = () => {
        if (themeMode === 'light') {
            setThemeMode('dark');
        } else {
            setThemeMode('light');
        }
    }

    return (
        <div id="more-menu-wrapper">
            <div onClick={() => setNavbarMorePopup()} className="more-popup-close"></div>
            <div id="more-menu">
                <div>
                    <div>Settings</div>
                    <div onClick={() => toggleLightDarkMode()}>Switch Appearance</div>
                </div>
                <div className="logout-div">Logout</div>
            </div>
        </div>
    );
};

export default NavbarMoreMenu;