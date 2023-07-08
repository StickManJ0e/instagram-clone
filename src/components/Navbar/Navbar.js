import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/nav/Navbar.css';
import PostCreateMenu from "../Post/PostCreateMenu";
import { useAuthContext } from "../../context/AuthContext";
import NavbarMoreMenu from "./NavbarMoreMenu";
import NavbarSearchMenu from "./NavbarSearchMenu";
import InstagramLogo from "../Misc/instagram-logo";
import NavbarNotificationsMenu from "../Navbar/NavbarNotificationsMenu";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase";

const Navbar = (props) => {
    const { setCurrentPopUp, styling } = props;
    const [NavbarMorePopup, setNavbarMorePopup] = useState();
    const [NavbarPopup, setNavbarPopup] = useState();
    const [navbarStyling, setNavbarStyling] = useState();
    const { loggedIn, userData, userDoc } = useAuthContext();
    const [read, setRead] = useState(true);
    let navigate = useNavigate();

    const navigateMain = (path) => {
        navigate(path)
    };

    const onCreateClick = () => {
        setCurrentPopUp(<PostCreateMenu setCurrentPopUp={setCurrentPopUp} />);
    }

    const navigateProfile = () => {
        navigateMain(`/profile/${userDoc.username}`)
    }

    const onSearchClick = () => {
        if (NavbarPopup === undefined) {
            setNavbarPopup(<NavbarSearchMenu setNavbarPopup={setNavbarPopup} setNavbarStyling={setNavbarStyling} />);
        } else {
            setNavbarPopup();
        }
    };

    const onMoreClick = () => {
        if (NavbarMorePopup === undefined) {
            setNavbarMorePopup(<NavbarMoreMenu setNavbarMorePopup={setNavbarMorePopup} />)
        } else {
            setNavbarMorePopup();
        }
    }

    //Open and close notifcations menu on click
    const onNotificationsClick = () => {
        setRead(true);
        if (NavbarPopup === undefined) {
            setNavbarPopup(<NavbarNotificationsMenu setNavbarPopup={setNavbarPopup} setNavbarStyling={setNavbarStyling} />);
            readNotifications();
        } else {
            setNavbarPopup();
        };
    };

    //Check if notification is read
    const checkNotificationsRead = async () => {
        const notificationRef = collection(firestore, "users", userDoc.uid, "notifications");
        const notifcationQuery = query(notificationRef, where("read", "==", false));
        const notificatonSnapshot = await getDocs(notifcationQuery);
        notificatonSnapshot.forEach((document) => {
            if (document.exists()) {
                setRead(false);
                console.log(false);
            };
        });
    };

    const readNotifications = async () => {
        const notificationRef = collection(firestore, "users", userDoc.uid, "notifications");
        const notifcationQuery = query(notificationRef, where("read", "==", false));
        const notificatonSnapshot = await getDocs(notifcationQuery);
        notificatonSnapshot.forEach(async (document) => {
            const ref = doc(firestore, "users", userDoc.uid, "notifications", document.id);
            await updateDoc(ref, {
                read: true,
            });
        });
    }

    useEffect(() => {
        if (styling !== undefined) {
            setNavbarStyling(styling);
        }
    }, [styling]);

    useEffect(() => {
        checkNotificationsRead();
    })

    return (
        <div id="navbar" style={navbarStyling}>
            {NavbarPopup}
            <div id="logo-div">
                <InstagramLogo height={29} width={103} />
            </div>
            <div id="navbar-buttons-div">
                <div onClick={() => navigateMain('/')}>Home</div>
                <div id="search-button" onClick={() => onSearchClick()}>Search</div>
                <div onClick={() => navigateMain('/messages')}>Messages</div>
                {read ? <div id='notifications-button' className="read" onClick={() => onNotificationsClick()}>Notifcations</div>
                    : <div id='notifications-button' className="not-read" onClick={() => onNotificationsClick()}>Notifcations</div>}
                <div onClick={() => onCreateClick()}>Create</div>
                <div onClick={() => navigateProfile()}>Profile</div>
            </div>
            <div id="more-div">
                {NavbarMorePopup}
                <div id='more-button' onClick={() => onMoreClick()}>More</div>
            </div>
        </div>
    );
};

export default Navbar;