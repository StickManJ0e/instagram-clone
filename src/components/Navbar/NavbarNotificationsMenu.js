import React, { useEffect } from "react";
import '../../styles/nav/NavbarNotificationsMenu.css'

const NavbarNotificationsMenu = (props) => {
    const { setNavbarPopup, setNavbarStyling } = props;

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
            Notifications
        </div>
    );
};

export default NavbarNotificationsMenu;