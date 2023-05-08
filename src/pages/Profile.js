import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import Navbar from '../components/Navbar/Navbar'
import ProfileHeader from "../components/Profile/ProfileHeader";
import '../styles/profile/Profile.css'


const Profile = (props) => {
    const { profileUser, setProfileUser } = props;
    const { loggedIn, userData, userDoc } = useAuthContext();
    const [currentPopUp, setCurrentPopUp] = useState();
    const [currentPosts, setCurrentPosts] = useState([]);

    return (
        <div id="profile-wrapper">
            <Navbar setCurrentPopUp={setCurrentPopUp} setProfileUser={setProfileUser} />
            <div id="profile">
                <ProfileHeader profileUser={profileUser} />
            </div>
        </div>
    );
};

export default Profile;