import React, { useEffect, useState } from "react";
import { firestore } from "../../firebase";
import { useAuthContext } from "../../context/AuthContext";
import { query, collection, getDocs, orderBy } from "firebase/firestore";

const Notifications = (props) => {
    const { currentNotifications, setCurrentNotifications } = props;
    const { loggedIn, userData, userDoc } = useAuthContext();
    const notificationsRef = collection(firestore, 'users', userDoc.uid, 'notifications');

    const getNotifications = async () => {
        const notificationsQuerySnapshot = await getDocs(query(notificationsRef, orderBy('timestamp', 'desc')));
        let newArray = currentNotifications;

        notificationsQuerySnapshot.forEach((document) => {
            newArray.push(document.data());
            setCurrentNotifications(newArray);
        })
    }

    return (
        <div>Notifications</div>
    );
};

export default Notifications;