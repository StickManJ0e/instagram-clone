import React, { useEffect } from "react";
import '../../styles/nav/NavbarNotificationsMenu.css';
import Notifications from "../Notifications/Notifications";

const NavbarNotificationsMenu = (props) => {
    const { setNavbarPopup, setNavbarStyling, currentNotifications, setCurrentNotifications } = props;

    const addNavbarStyling = () => {
        setNavbarStyling({
            width: 'var(--navbar-narrow-width)',
            minwidth: 'var(--navbar-narrow-width)'
        });
    };

    const handleClickOutside = (e) => {
        let wrapper = document.querySelector('#notifications-menu-wrapper');
        let notificationsButton = document.querySelector('#notifications-button');
        if (!(wrapper.contains(e.target)) && e.target !== notificationsButton) {
            setNavbarPopup();
        };
    }

    useEffect(() => {
        addNavbarStyling();
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            setNavbarStyling();
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);

    return (
        <div id='notifications-menu-wrapper'>
            <Notifications setCurrentNotifications={setCurrentNotifications} currentNotifications={currentNotifications} />
        </div>
    );
};

export default NavbarNotificationsMenu;