import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { firestore } from "../../firebase";
import { doc, setDoc, getDoc, query, deleteDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";

const FollowButton = (props) => {
    const { profileUser } = props;
    const [isFollowing, setIsFollowing] = useState();
    const { loggedIn, userData, userDoc } = useAuthContext();

    const usersRef = doc(firestore, 'users', userData.uid, 'following', profileUser.uid);
    const profileRef = doc(firestore, 'users', profileUser.uid, 'followers', userData.uid);
    const notificationsRef = doc(firestore, 'users', profileUser.uid, 'notifications', profileUser.uid);

    //Check if user is following the account
    const checkFollowing = async () => {
        const docSnap = await getDoc(query(usersRef));
        if (docSnap.exists()) {
            setIsFollowing(true);
        } else {
            setIsFollowing(false);
        };
    };

    //Follow account
    const followProfile = async () => {
        await setDoc(usersRef, profileUser);
        await setDoc(profileRef, userDoc);
        if (checkNotified() === false) {
            sendFollowNotifictaion();
        }
    };

    //Unfollow Account
    const unFollowProfile = async () => {
        await deleteDoc(usersRef);
        await deleteDoc(profileRef);
    };

    //Send notification
    const sendFollowNotifictaion = async () => {
        const NotificationsObject = (type, document, documentId, timestamp, read) => {
            return {
                type,
                document,
                documentId,
                timestamp,
                read,
            };
        };
        const object = NotificationsObject('follower', userDoc, userDoc.uid, serverTimestamp(), false);
        await setDoc(notificationsRef, object);
    };

    const checkNotified = async () => {
        const docSnap = await getDoc(notificationsRef);
        if (docSnap.exists()) {
            return true;
        } else {
            return false;
        };
    };

    //Check whether user is following account and then follow
    const onFollowClick = () => {
        if (isFollowing === false) {
            followProfile();
            setIsFollowing(true);
        };
        if (isFollowing === true) {
            unFollowProfile();
            setIsFollowing(false);
        };
    };

    useEffect(() => {
        checkFollowing();
    }, []);

    if (isFollowing) {
        return (
            <div id="follow-button" onClick={() => onFollowClick()}>Following</div>
        )
    } else {
        return (
            <div id="follow-button" onClick={() => onFollowClick()}>Follow</div>
        )
    }

}

export default FollowButton;