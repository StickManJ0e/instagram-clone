import React from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/nav/Navbar.css';
import PostCreateMenu from "../Post/PostCreateMenu";

const Navbar = (props) => {
    const { setCurrentPopUp } = props;
    let navigate = useNavigate();

    const navigateMain = (path) => {
        navigate(path)
    };

    const onCreateClick = () => {
        setCurrentPopUp(<PostCreateMenu setCurrentPopUp={setCurrentPopUp} />);
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
                <div>More</div>
            </div>
        </div>
    );
};

export default Navbar;