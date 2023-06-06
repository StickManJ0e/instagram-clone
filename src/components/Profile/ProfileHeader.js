import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import { getCountFromServer, collection, doc, setDoc, getDoc, query, deleteDoc } from "firebase/firestore";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfileHeader = (props) => {
    const { profileUser } = props;
    const [postCount, setPostCount] = useState();
    const [followerCount, setFollowerCount] = useState();
    const [followingCount, setFollowingCount] = useState();
    const [isFollowing, setIsFollowing] = useState();
    const { loggedIn, userData, userDoc } = useAuthContext();
    const usersRef = doc(firestore, 'users', userData.uid, 'following', profileUser.uid);
    const profileRef = doc(firestore, 'users', profileUser.uid, 'followers', userData.uid);
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

    //Check if user is following the account
    const checkFollowing = async () => {
        const docSnap = await getDoc(query(usersRef));
        if (docSnap.exists()) {
            setIsFollowing(true);
        } else {
            setIsFollowing(false);
        }
    }

    //Follow account
    const followProfile = async () => {
        await setDoc(usersRef, profileUser);
        await setDoc(profileRef, userDoc);
    }

    //Unfollow Account
    const unFollowProfile = async () => {
        await deleteDoc(usersRef);
        await deleteDoc(profileRef);
    }

    //Check whether user is following account and then follow
    const onFollowClick = () => {
        if (isFollowing === false) {
            followProfile();
            setIsFollowing(true);
        }
        if (isFollowing === true) {
            unFollowProfile();
            setIsFollowing(false);
        }
    }

    //Set post, follower, and following counts and check if following account on profile load
    useEffect(() => {
        getCounts();
        checkFollowing();
    });

    const userProfileElm = (
        <div className="">
            <div>{profileUser.username}</div>
            <button id="edit-profile-button" onClick={() => navigate('/settings/edit')}>Edit Profile</button>
        </div>
    );

    const isFollowingProfileElm = (
        <div>
            <div>{profileUser.username}</div>
            <button id="follow-button" onClick={() => onFollowClick()}>Following</button>
            <button onClick={() => navigate('/messages')}>Message</button>
        </div>
    )

    const notFollowingProfileElm = (
        <div>
            <div>{profileUser.username}</div>
            <button id="follow-button" onClick={() => onFollowClick()}>Follow</button>
            <button onClick={() => navigate('/messages')} >Message</button>
        </div>
    )

    return (
        <div className="profile-header">
            <img className="header-profile-picture" src={profileUser.photoUrl} alt="profile" />
            <div className="profile-header-main">
                {(profileUser.uid === userData.uid) ? userProfileElm :
                    (profileUser.uid !== userData.uid && isFollowing === true) ? isFollowingProfileElm :
                        (profileUser.uid !== userData.uid && isFollowing === false) ? notFollowingProfileElm :
                            <div></div>}
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
