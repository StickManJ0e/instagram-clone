import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/nav/Navbar.css';
import PostCreateMenu from "../Post/PostCreateMenu";
import { useAuthContext } from "../../context/AuthContext";
import NavbarMoreMenu from "./NavbarMoreMenu";
import NavbarSearchMenu from "./NavbarSearchMenu";
import NavbarNotificationsMenu from "./NavbarNotificationsMenu";
import InstagramLogo from "../Misc/instagram-logo";

const Navbar = (props) => {
    const { setCurrentPopUp, styling } = props;
    const [NavbarMorePopup, setNavbarMorePopup] = useState();
    const [NavbarPopup, setNavbarPopup] = useState();
    const [navbarStyling, setNavbarStyling] = useState();
    const { loggedIn, userData, userDoc } = useAuthContext();
    let navigate = useNavigate();

    const navigateMain = (path) => {
        navigate(path)
    };

    const onCreateClick = () => {
        setCurrentPopUp(<PostCreateMenu setCurrentPopUp={setCurrentPopUp} />);
    }

    const navigateProfile = () => {
        navigateMain(`/profile/${userDoc.username}`)
    }

    const onSearchClick = () => {
        if (NavbarPopup === undefined) {
            setNavbarPopup(<NavbarSearchMenu setNavbarPopup={setNavbarPopup} setNavbarStyling={setNavbarStyling} />);
        } else {
            setNavbarPopup();
        }
    };

    const onMoreClick = () => {
        if (NavbarMorePopup === undefined) {
            setNavbarMorePopup(<NavbarMoreMenu setNavbarMorePopup={setNavbarMorePopup} />)
        } else {
            setNavbarMorePopup();
        }
    }

    const onNotificationsClick = () => {
        if (NavbarPopup === undefined) {
            setNavbarPopup(<NavbarNotificationsMenu setNavbarPopup={setNavbarPopup} setNavbarStyling={setNavbarStyling} />);
        } else {
            setNavbarPopup();
        }
    }

    useEffect(() => {
        if (styling !== undefined) {
            setNavbarStyling(styling);
        }
    }, [styling])

    return (
        <div id="navbar" style={navbarStyling}>
            {NavbarPopup}
            <div id="logo-div">
                <InstagramLogo height={29} width={103}/>
            </div>
            <div id="navbar-buttons-div">
                <div onClick={() => navigateMain('/')}>Home</div>
                <div id="search-button" onClick={() => onSearchClick()}>Search</div>
                <div onClick={() => navigateMain('/messages')}>Messages</div>
                <div id='notifications-button' onClick={() => onNotificationsClick()}>Notifcations</div>
                <div onClick={() => onCreateClick()}>Create</div>
                <div onClick={() => navigateProfile()}>Profile</div>
            </div>
            <div id="more-div">
                {NavbarMorePopup}
                <div id='more-button' onClick={() => onMoreClick()}>More</div>
            </div>
        </div>
    );
};

export default Navbar;