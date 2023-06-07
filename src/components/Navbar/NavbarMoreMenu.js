import React from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useDarkLightContext } from "../../context/DarkLightContext";
import { useNavigate } from "react-router-dom";

const NavbarMoreMenu = (props) => {
    const { setNavbarMorePopup } = props;
    const { themeMode, setThemeMode } = useDarkLightContext();
    const navigate = useNavigate();

    const toggleLightDarkMode = () => {
        if (themeMode === 'light') {
            setThemeMode('dark');
        } else {
            setThemeMode('light');
        };
    };

    const logout = () => {
        signOut(auth).then(() => {
            navigate('/');
        }).catch((error) => {
            console.log(error);
        })
    };

    return (
        <div id="more-menu-wrapper">
            <div onClick={() => setNavbarMorePopup()} className="more-popup-close"></div>
            <div id="more-menu">
                <div className="more-options">
                    <div onClick={() => navigate('/settings/account')}>Settings</div>
                    <div onClick={() => toggleLightDarkMode()}>Switch Appearance</div>
                </div>
                <div className="logout-div" onClick={() => logout()}>Logout</div>
            </div>
        </div>
    );
};

export default NavbarMoreMenu;