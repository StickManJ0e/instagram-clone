import React, { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import Navbar from '../components/Navbar/Navbar'
import Posts from "../components/Post/Posts";
import ProfileHeader from "../components/Profile/ProfileHeader";
import '../styles/profile/Profile.css'
import { firestore } from "../firebase";
import { collection, where, getDocs, query } from "firebase/firestore";
import { useParams } from "react-router-dom";

const Profile = (props) => {
    const [profileUser, setProfileUser] = useState();
    const { loggedIn, userData, userDoc } = useAuthContext();
    const [currentPopUp, setCurrentPopUp] = useState();
    const [currentPosts, setCurrentPosts] = useState([]);
    const [postRef, setPostRef] = useState();
    const [post, setPost] = useState();
    const { id } = useParams();

    //Get profile data from id param
    const getProfile = async () => {
        const profileQuery = query(collection(firestore, "users"), where("username", "==", id));
        const querySnapshot = await getDocs(profileQuery);
        let userData;
        querySnapshot.forEach((document) => {
            userData = document.data();
        });
        setProfileUser(userData);
        setPostRef(collection(firestore, 'users', userData.uid, 'posts'));
    };

    useEffect(() => {
        if (profileUser !== undefined && profileUser.uid === userDoc.uid) {
            setProfileUser(userDoc);
        }
    }, [userDoc, profileUser]);

    useEffect(() => {
        getProfile();
        setCurrentPopUp();
        setCurrentPosts([]);
    }, [id]);

    useEffect(() => {
        if (postRef !== undefined) {
            setPost(<Posts key={postRef.path} postType={'profile'} postRef={postRef} currentPosts={currentPosts} setCurrentPosts={setCurrentPosts} setCurrentPopUp={setCurrentPopUp} />)
        }
    }, [postRef])

    if (profileUser !== undefined && postRef !== undefined) {
        return (
            <div id="profile-wrapper">
                <Navbar setCurrentPopUp={setCurrentPopUp} />
                <div id="profile">
                    <ProfileHeader profileUser={profileUser} />
                    <div className="profile-posts">
                        {post}
                    </div>
                </div>
                {currentPopUp}
            </div>
        );
    }

};

export default Profile;