import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import Navbar from '../components/Navbar/Navbar'
import Posts from "../components/Post/Posts";
import ProfileHeader from "../components/Profile/ProfileHeader";
import '../styles/profile/Profile.css'
import { firestore } from "../firebase";
import { collection } from "firebase/firestore";


const Profile = (props) => {
    const { profileUser, setProfileUser } = props;
    const { loggedIn, userData, userDoc } = useAuthContext();
    const [currentPopUp, setCurrentPopUp] = useState();
    const [currentPosts, setCurrentPosts] = useState([]);
    const postRef = collection(firestore, 'users', profileUser.uid, 'posts');

    useEffect(() => {
        if (profileUser.uid === userDoc.uid) {
            setProfileUser(userDoc);
        }
    }, [userDoc]);

    return (
        <div id="profile-wrapper">
            <Navbar setCurrentPopUp={setCurrentPopUp} setProfileUser={setProfileUser} />
            <div id="profile">
                <ProfileHeader profileUser={profileUser} setProfileUser={setProfileUser} />
                <div className="profile-posts">
                    <Posts postType={'profile'} postRef={postRef} setProfileUser={setProfileUser} currentPosts={currentPosts} setCurrentPosts={setCurrentPosts} setCurrentPopUp={setCurrentPopUp} />
                </div>
            </div>
            {currentPopUp}
        </div>
    );
};

export default Profile;