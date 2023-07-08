import React, { useEffect, useState } from "react";
import { firestore } from "../../firebase";
import { useAuthContext } from "../../context/AuthContext";
import { query, collection, getDocs, orderBy } from "firebase/firestore";
import '../../styles/notifications/Notifications.css'

const Notifications = () => {
    const { loggedIn, userData, userDoc } = useAuthContext();
    const [currentNotifications, setCurrentNotifications] = useState([]);
    const notificationsRef = collection(firestore, 'users', userDoc.uid, 'notifications');

    //Filter a given array for unqiue posts based of docId
    const filterArrayWithId = (array) => {
        if (array.length > 0) {
            const filteredData = array.filter((value, index, self) =>
                self.findIndex(v => v.id === value.id) === index
            );
            return filteredData;
        }
    }

    //Get notifications at start
    const getNotifications = async () => {
        const notificationsQuerySnapshot = await getDocs(query(notificationsRef, orderBy('timestamp', 'desc')));
        let newArray = currentNotifications;

        notificationsQuerySnapshot.forEach((document) => {
            newArray.push({ ...document.data(), id: document.id });
            setCurrentNotifications(filterArrayWithId(newArray));
        });
    };

    useEffect(() => {
        getNotifications();
    }, []);

    //Get Difference between current date and timestamp
    const getDate = (timestamp) => {
        let current = new Date().getTime();
        let alteredTimestamp = new Date((timestamp.seconds * 1000) + (timestamp.nanoseconds / 1000000)).getTime();
        let timeDif = current - alteredTimestamp;

        //Check if timeDif is equal or greater than a day
        if ((timeDif / (1000 * 60 * 60 * 24)) >= 1) {
            return (`${(timeDif / (1000 * 60 * 60 * 24)).toFixed(0)} d`);

            //Check if timeDif is equal or greater than a hour
        } else if ((timeDif / (1000 * 60 * 60)) >= 1) {
            return (`${(timeDif / (1000 * 60 * 60)).toFixed(0)} h`);

            //Return timeDif to the minute
        } else {
            return (`${(timeDif / (1000 * 60)).toFixed(0)} m`);
        };
    };

    const followerObject = (notification) => {
        return (
            <div className="notification-div follower">
                <img className="messages-profile-picture" src={notification.document.photoUrl} alt="profile" />
                <div>{notification.document.username} started following you. {timestampObject(notification)}</div>
            </div>
        );
    };

    const likedObject = (notification) => {
        return (
            <div className="notification-div liked">
                <img className="messages-profile-picture" src={notification.document.profile.photoUrl} alt="profile" />
                <div>{notification.document.profile.username} liked your post. {timestampObject(notification)}</div>
            </div>
        );
    };

    const commentObject = (notification) => {
        return (
            <div className="notification-div comment">
                <img className="messages-profile-picture" src={notification.document.profile.photoUrl} alt="profile" />
                <div>{notification.document.profile.username} commented: {notification.document.comment.comment} {timestampObject(notification)}</div>
            </div>
        );
    };

    const timestampObject = (notification) => {
        return (
            <div className="notifcation-timestamp">{getDate(notification.timestamp)}</div>
        )
    }

    return (
        <div id="notificatins-div">
            {(currentNotifications) ? currentNotifications.map((notification) => {
                switch (notification.type) {
                    case 'follower':
                        return (followerObject(notification));
                    case 'liked':
                        return (likedObject(notification));
                    case 'comment':
                        return (commentObject(notification));
                    default:
                        break;
                }
            }) : 
            <div>No notifications.</div>}
        </div>
    );
};

export default Notifications;