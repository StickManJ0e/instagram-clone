import React from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/nav/Navbar.css';
import PostCreateMenu from "../Post/PostCreateMenu";
import { useDarkLightContext } from "../../context/DarkLightContext";
import { useAuthContext } from "../../context/AuthContext";

const Navbar = (props) => {
    const { setCurrentPopUp, setProfileUser } = props;
    const { loggedIn, userData, userDoc } = useAuthContext();
    const {themeMode, setThemeMode} = useDarkLightContext();
    let navigate = useNavigate();

    const navigateMain = (path) => {
        navigate(path)
    };

    const onCreateClick = () => {
        setCurrentPopUp(<PostCreateMenu setCurrentPopUp={setCurrentPopUp} />);
    }

    const toggleLightDarkMode = () => {
        if (themeMode === 'light') {
            setThemeMode('dark');
        } else {
            setThemeMode('light');
        }
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
                <div onClick={() => toggleLightDarkMode()}>Light/Dark Mode</div>
                <div>More</div>
            </div>
        </div>
    );
};

export default Navbar;