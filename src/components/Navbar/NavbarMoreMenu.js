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
                <div onClick={() => navigate('/settings/account')}>
                    <svg aria-label="Settings" color="var(--mode-text-color)" fill="var(--mode-text-color)" height={18} role="img" viewBox="0 0 24 24" width={18}>
                        <title>Settings</title>
                        <circle cx="12" cy="12" fill="none" r="8.635" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle>
                        <path d="M14.232 3.656a1.269 1.269 0 0 1-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 0 1-.796.66m-.001 16.688a1.269 1.269 0 0 1 .796.66l.505.996h1.862l.505-.996a1.269 1.269 0 0 1 .796-.66M3.656 9.768a1.269 1.269 0 0 1-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 0 1 .66.796m16.688-.001a1.269 1.269 0 0 1 .66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 0 1-.66-.796M7.678 4.522a1.269 1.269 0 0 1-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 0 1-.096 1.03m11.8 11.799a1.269 1.269 0 0 1 1.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 0 1 .096-1.03m-14.956.001a1.269 1.269 0 0 1 .096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 0 1 1.03.096m11.799-11.8a1.269 1.269 0 0 1-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 0 1-1.03-.096" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path>
                    </svg>
                    Settings
                </div>
                <div onClick={() => toggleLightDarkMode()}>
                    <svg aria-label="Theme icon" color="var(--mode-text-color)" fill="var(--mode-text-color)" height={18} role="img" viewBox="0 0 24 24" width={18}>
                        <title>Theme icon</title>
                        <path d="M12.00018,4.5a1,1,0,0,0,1-1V2a1,1,0,0,0-2,0V3.5A1.00005,1.00005,0,0,0,12.00018,4.5ZM5.28241,6.69678A.99989.99989,0,1,0,6.69647,5.28271l-1.06054-1.061A.99989.99989,0,0,0,4.22186,5.63574ZM4.50018,12a1,1,0,0,0-1-1h-1.5a1,1,0,0,0,0,2h1.5A1,1,0,0,0,4.50018,12Zm.78223,5.30322-1.06055,1.061a.99989.99989,0,1,0,1.41407,1.41406l1.06054-1.061a.99989.99989,0,0,0-1.41406-1.41407ZM12.00018,19.5a1.00005,1.00005,0,0,0-1,1V22a1,1,0,0,0,2,0V20.5A1,1,0,0,0,12.00018,19.5Zm6.71729-2.19678a.99989.99989,0,0,0-1.41406,1.41407l1.06054,1.061A.99989.99989,0,0,0,19.778,18.36426ZM22.00018,11h-1.5a1,1,0,0,0,0,2h1.5a1,1,0,0,0,0-2ZM18.01044,6.98975a.996.996,0,0,0,.707-.293l1.06055-1.061A.99989.99989,0,0,0,18.364,4.22168l-1.06054,1.061a1,1,0,0,0,.707,1.707ZM12.00018,6a6,6,0,1,0,6,6A6.00657,6.00657,0,0,0,12.00018,6Zm0,10a4,4,0,1,1,4-4A4.00458,4.00458,0,0,1,12.00018,16Z"></path>
                    </svg>
                    Switch Appearance
                </div>
            </div>
            <div id="more-menu-divider"></div>
            <div className="logout-div" onClick={() => logout()}>Logout</div>
        </div>
    );
};

export default NavbarMoreMenu;