import React, { useEffect } from "react";
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

    const handleClickOutside = (e) => {
        let wrapper = document.querySelector('#more-menu');
        let button = document.querySelector('#more-button');
        if (!(wrapper.contains(e.target)) && e.target !== button) {
            setNavbarMorePopup();
        };
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);

    return (
        <div id="more-menu">
            <div className="more-options">
                <div onClick={() => navigate('/settings/account')}>Settings</div>
                <div onClick={() => toggleLightDarkMode()}>Switch Appearance</div>
            </div>
            <div className="logout-div" onClick={() => logout()}>Logout</div>
        </div>
    );
};

export default NavbarMoreMenu;