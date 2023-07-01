import React, { useEffect, useState } from "react";
import { firestore } from "../../firebase";
import { useAuthContext } from "../../context/AuthContext";
import { onSnapshot, query, collection, getDocs, orderBy, serverTimestamp } from "firebase/firestore";

const Notifications = () => {
    const { loggedIn, userData, userDoc } = useAuthContext();
    const [currentNotifications, setCurrentNotifications] = useState([]);
    const notificationsRef = collection(firestore, 'users', userDoc.uid, 'notifications');
    const followersRef = collection(firestore, 'users', userDoc.uid, 'followers');
    const NotificationsObject = (id, type, document, documentId, timestamp) => {
        return {
            id,
            type,
            document,
            documentId,
            timestamp,
        }
    };

    const addNotificationDoc = async (ref, object) => {

    }

    const getNotifications = async () => {
        const notificationsQuerySnapshot = await getDocs(query(notificationsRef, orderBy('timestamp', 'desc')));
        let newArray = currentNotifications;

        notificationsQuerySnapshot.forEach((document) => {
            newArray.push(document.data());
            setCurrentNotifications(newArray);
        })
    }

    //Listen for new followers
    const followersListener = () => {
        onSnapshot(query(followersRef), (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                let index = currentNotifications.findIndex((notification) => notification.document.id === change.doc.id);

                if ((change.type === 'added') && (index === -1)) {
                    let object = NotificationsObject(change.doc.id, 'followers', change.doc.data(), change.doc.id, serverTimestamp());
                    addNotificationDoc(followersRef, object);
                }
            });
        });
    };

    useEffect(() => {
        followersListener();
    })

    return (
        <div>Notifications</div>
    );
};

export default Notifications;