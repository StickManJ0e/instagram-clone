import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import { getCountFromServer, collection } from "firebase/firestore";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FollowButton from "./FollowButton";

const ProfileHeader = (props) => {
    const { profileUser } = props;
    const [postCount, setPostCount] = useState();
    const [followerCount, setFollowerCount] = useState();
    const [followingCount, setFollowingCount] = useState();
    const { loggedIn, userData, userDoc } = useAuthContext();
    const navigate = useNavigate();

    //Get number of posts, followers and following and set respective states
    const getCounts = async () => {
        const postSnapshot = await getCountFromServer(collection(firestore, 'users', profileUser.uid, 'liked'));
        setPostCount(postSnapshot.data().count);

        const followerSnapshot = await getCountFromServer(collection(firestore, 'users', profileUser.uid, 'followers'));
        setFollowerCount(followerSnapshot.data().count);

        const followingSnapshot = await getCountFromServer(collection(firestore, 'users', profileUser.uid, 'following'));
        setFollowingCount(followingSnapshot.data().count);
    };

    //Set post, follower, and following counts and check if following account on profile load
    useEffect(() => {
        getCounts();

    });

    const userProfileElm = (
        <div className="">
            <div>{profileUser.username}</div>
            <button id="edit-profile-button" onClick={() => navigate('/settings/edit')}>Edit Profile</button>
        </div>
    );

    const otherProfileElm = (
        <div>
            <div>
                <div>{profileUser.username}</div>
                <FollowButton profileUser={profileUser} />
                <button onClick={() => navigate('/messages')} >Message</button>
            </div>
        </div>
    )

    return (
        <div className="profile-header">
            <img className="header-profile-picture" src={profileUser.photoUrl} alt="profile" />
            <div className="profile-header-main">
                {(profileUser.uid === userData.uid) ? userProfileElm :
                    otherProfileElm}
                <div className="counts-div">
                    <div>{postCount} post</div>
                    <div>{followerCount} followers</div>
                    <div>{followingCount} following</div>
                </div>
                <div>{profileUser.displayName}</div>
                {(profileUser.bio !== undefined) ? <div>{profileUser.bio}</div> : ''}
            </div>
        </div>
    );
};

export default ProfileHeader;
