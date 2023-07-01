import React from "react";
import NavbarNotificationsMenu from "../Navbar/NavbarNotificationsMenu";

const NotifcationsButton = (props) => {
    const { NavbarPopup, setNavbarPopup, setNavbarStyling } = props;
    
    const onNotificationsClick = () => {
        if (NavbarPopup === undefined) {
            setNavbarPopup(<NavbarNotificationsMenu setNavbarPopup={setNavbarPopup} setNavbarStyling={setNavbarStyling} />);
        } else {
            setNavbarPopup();
        }
    }

    return (
        <div id='notifications-button' onClick={() => onNotificationsClick()}>Notifcations</div>
    );
};

export default NotifcationsButton;