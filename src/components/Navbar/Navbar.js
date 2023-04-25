import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/nav/Navbar.css';
import PostCreateMenu from "../Post/PostCreateMenu";

const Navbar = (props) => {
    const { setCurrentPopUp } = props;
    const [themeMode, setThemeMode] = useState('light');
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
            document.documentElement.style.setProperty('--mode-background-color', 'rgb(0, 0, 0)');
            document.documentElement.style.setProperty('--mode-text-color', 'rgb(255, 255, 255)');
            document.documentElement.style.setProperty('--mode-background-color-hover', 'rgba(255, 255, 255, 0.1)');
        } else {
            setThemeMode('light');
            document.documentElement.style.setProperty('--mode-background-color', 'rgb(255, 255, 255)');
            document.documentElement.style.setProperty('--mode-text-color', 'rgb(0, 0, 0)');
            document.documentElement.style.setProperty('--mode-background-color-hover', 'rgba(0, 0,0, 0.05)');
        }
    }

    return (
        <div id="navbar">
            <div id="logo-div">Logo</div>
            <div id="navbar-buttons-div">
                <div onClick={() => navigateMain('')}>Home</div>
                <div>Search</div>
                <div onClick={() => navigateMain('messages')}>Messages</div>
                <div>Notifcations</div>
                <div onClick={() => onCreateClick()}>Create</div>
                <div onClick={() => navigateMain('profile')}>Profile</div>
            </div>
            <div id="more-div">
                <div onClick={() => toggleLightDarkMode()}>Light/Dark Mode</div>
                <div>More</div>
            </div>
        </div>
    );
};

export default Navbar;