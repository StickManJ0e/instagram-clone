import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/nav/Navbar.css';
import PostCreateMenu from "../Post/PostCreateMenu";
import { useDarkLightContext } from "../../context/DarkLightContext";
import { useAuthContext } from "../../context/AuthContext";
import NavbarMoreMenu from "./NavbarMoreMenu";

const Navbar = (props) => {
    const { setCurrentPopUp, setProfileUser } = props;
    const [NavbarMorePopup, setNavbarMorePopup] = useState();
    const { loggedIn, userData, userDoc } = useAuthContext();
    let navigate = useNavigate();

    const navigateMain = (path) => {
        navigate(path)
    };

    const onCreateClick = () => {
        setCurrentPopUp(<PostCreateMenu setCurrentPopUp={setCurrentPopUp} />);
    }

    const navigateProfile = () => {
        setProfileUser(userDoc);
        navigateMain(`/profile/${userDoc.username}`)
    }

    return (
        <div id="navbar">
            <div id="logo-div">Logo</div>
            <div id="navbar-buttons-div">
                <div onClick={() => navigateMain('/')}>Home</div>
                <div>Search</div>
                <div onClick={() => navigateMain('/messages')}>Messages</div>
                <div>Notifcations</div>
                <div onClick={() => onCreateClick()}>Create</div>
                <div onClick={() => navigateProfile()}>Profile</div>
            </div>
            <div id="more-div">
                {NavbarMorePopup}
                <div onClick={() => setNavbarMorePopup(<NavbarMoreMenu setNavbarMorePopup={setNavbarMorePopup} />)}>More</div>
            </div>
        </div>
    );
};

export default Navbar;