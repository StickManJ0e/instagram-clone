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
import { useMediaQuery } from "usehooks-ts";

const Navbar = (props) => {
    const { setCurrentPopUp, styling, narrow } = props;
    const [NavbarMorePopup, setNavbarMorePopup] = useState();
    const [navbarNarrow, setNavbarNarrow] = useState();
    const [NavbarPopup, setNavbarPopup] = useState();
    const [navbarStyling, setNavbarStyling] = useState();
    const { loggedIn, userData, userDoc } = useAuthContext();
    const [read, setRead] = useState(true);
    let navigate = useNavigate();
    const matches = useMediaQuery('(max-width: 850px)');

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
            setNavbarNarrow(true);
            setNavbarPopup(<NavbarSearchMenu setNavbarPopup={setNavbarPopup} setNavbarStyling={setNavbarStyling} setNavbarNarrow={setNavbarNarrow} />);
        } 
        else {
            setNavbarNarrow(false);
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
            setNavbarNarrow(true);
            setNavbarPopup(<NavbarNotificationsMenu setNavbarPopup={setNavbarPopup} setNavbarStyling={setNavbarStyling} setRead={setRead} setNavbarNarrow={setNavbarNarrow} />);
            readNotifications();
        } else {
            setNavbarNarrow(false);
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
        if (narrow !== undefined) {
            setNavbarNarrow(true);
        }
    }, [narrow]);

    useEffect(() => {
        checkNotificationsRead();
    });

    //Logo variables
    const homeLogo = (
        <svg aria-label="Home" color="var(--mode-text-color)" fill="var(--mode-text-color)" height={24} role="img" viewBox="0 0 24 24" width={24}>
            <path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"></path>
        </svg>
    );

    const searchLogo = (
        <svg aria-label="Search" color="var(--mode-text-color)" fill="var(--mode-text-color)" height={24} role="img" viewBox="0 0 24 24" width={24}>
            <path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
            <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="16.511" x2="22" y1="16.511" y2="22"></line>
        </svg>
    );

    const messagesLogo = (
        <svg aria-label="Direct" color="var(--mode-text-color)" fill="var(--mode-text-color)" height={24} role="img" viewBox="0 0 24 24" width={24}>
            <line fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
            <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></polygon>
        </svg>
    );

    const readNotificationLogo = (
        <svg aria-label="Notifications" color="var(--mode-text-color)" fill="var(--mode-text-color)" height={24} role="img" viewBox="0 0 24 24" width={24}>
            <title>Notifications</title>
            <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
        </svg>
    );

    const unreadNotificationLogo = (
        <div className="notification-logo">
            <svg aria-label="Notifications" color="var(--mode-text-color)" fill="var(--mode-text-color)" height={24} role="img" viewBox="0 0 24 24" width={24}>
                <title>Notifications</title>
                <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
            </svg>
            <div className="notificatins-badge"></div>
        </div>
    );

    const newPostLogo = (
        <svg aria-label="New post" color="var(--mode-text-color)" fill="var(--mode-text-color)" height={24} role="img" viewBox="0 0 24 24" width={24}>
            <path d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            </path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="6.545" x2="17.455" y1="12.001" y2="12.001"></line><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12.003" x2="12.003" y1="6.545" y2="17.455"></line>
        </svg>
    );

    const moreLogo = (
        <svg aria-label="Settings" color="var(--mode-text-color)" fill="var(--mode-text-color)" height={24} role="img" viewBox="0 0 24 24" width={24}>
            <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="3" x2="21" y1="4" y2="4"></line>
            <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="3" x2="21" y1="12" y2="12"></line>
            <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="3" x2="21" y1="20" y2="20"></line>
        </svg>
    );

    const instagramLogo = (
        <svg aria-label="Instagram" color="var(--mode-text-color)" fill="var(--mode-text-color)" height={24} role="img" viewBox="0 0 24 24" width={24}>
            <title>Instagram</title>
            <path d="M12 2.982c2.937 0 3.285.011 4.445.064a6.087 6.087 0 0 1 2.042.379 3.408 3.408 0 0 1 1.265.823 3.408 3.408 0 0 1 .823 1.265 6.087 6.087 0 0 1 .379 2.042c.053 1.16.064 1.508.064 4.445s-.011 3.285-.064 4.445a6.087 6.087 0 0 1-.379 2.042 3.643 3.643 0 0 1-2.088 2.088 6.087 6.087 0 0 1-2.042.379c-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064a6.087 6.087 0 0 1-2.043-.379 3.408 3.408 0 0 1-1.264-.823 3.408 3.408 0 0 1-.823-1.265 6.087 6.087 0 0 1-.379-2.042c-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445a6.087 6.087 0 0 1 .379-2.042 3.408 3.408 0 0 1 .823-1.265 3.408 3.408 0 0 1 1.265-.823 6.087 6.087 0 0 1 2.042-.379c1.16-.053 1.508-.064 4.445-.064M12 1c-2.987 0-3.362.013-4.535.066a8.074 8.074 0 0 0-2.67.511 5.392 5.392 0 0 0-1.949 1.27 5.392 5.392 0 0 0-1.269 1.948 8.074 8.074 0 0 0-.51 2.67C1.012 8.638 1 9.013 1 12s.013 3.362.066 4.535a8.074 8.074 0 0 0 .511 2.67 5.392 5.392 0 0 0 1.27 1.949 5.392 5.392 0 0 0 1.948 1.269 8.074 8.074 0 0 0 2.67.51C8.638 22.988 9.013 23 12 23s3.362-.013 4.535-.066a8.074 8.074 0 0 0 2.67-.511 5.625 5.625 0 0 0 3.218-3.218 8.074 8.074 0 0 0 .51-2.67C22.988 15.362 23 14.987 23 12s-.013-3.362-.066-4.535a8.074 8.074 0 0 0-.511-2.67 5.392 5.392 0 0 0-1.27-1.949 5.392 5.392 0 0 0-1.948-1.269 8.074 8.074 0 0 0-2.67-.51C15.362 1.012 14.987 1 12 1Zm0 5.351A5.649 5.649 0 1 0 17.649 12 5.649 5.649 0 0 0 12 6.351Zm0 9.316A3.667 3.667 0 1 1 15.667 12 3.667 3.667 0 0 1 12 15.667Zm5.872-10.859a1.32 1.32 0 1 0 1.32 1.32 1.32 1.32 0 0 0-1.32-1.32Z"></path>
        </svg>
    )

    if (matches || (navbarNarrow === true)) {
        return (
            <div id="navbar" style={navbarStyling}>
                {NavbarPopup}
                <div id="logo-div">
                    {instagramLogo}
                </div>
                <div id="navbar-buttons-div">
                    <div onClick={() => navigateMain('/')}>{homeLogo}</div>
                    <div id="search-button" onClick={() => onSearchClick()}>{searchLogo}</div>
                    <div onClick={() => navigateMain('/messages')}>{messagesLogo}</div>
                    {read ?
                        <div id='notifications-button' className="read" onClick={() => onNotificationsClick()}>{readNotificationLogo}</div>
                        :
                        <div id='notifications-button' className="not-read" onClick={() => onNotificationsClick()}>{unreadNotificationLogo}</div>}
                    <div onClick={() => onCreateClick()}>{newPostLogo}</div>
                    <div onClick={() => navigateProfile()}>
                        <img src={userDoc.photoUrl} alt="profile" id="profile-picture" height={24} width={24}></img>
                    </div>
                </div>
                <div id="more-div">
                    {NavbarMorePopup}
                    <div id='more-button' onClick={() => onMoreClick()}>{moreLogo}</div>
                </div>
            </div>
        )
    } else {
        return (
            <div id="navbar" style={navbarStyling}>
                {NavbarPopup}
                <div id="logo-div">
                    <InstagramLogo height={29} width={103} />
                </div>
                <div id="navbar-buttons-div">
                    <div onClick={() => navigateMain('/')}>{homeLogo} Home</div>
                    <div id="search-button" onClick={() => onSearchClick()}>{searchLogo} Search</div>
                    <div onClick={() => navigateMain('/messages')}>{messagesLogo} Messages</div>
                    {read ?
                        <div id='notifications-button' className="read" onClick={() => onNotificationsClick()}>{readNotificationLogo} Notifcations</div>
                        :
                        <div id='notifications-button' className="not-read" onClick={() => onNotificationsClick()}>{unreadNotificationLogo} Notifcations</div>}
                    <div onClick={() => onCreateClick()}>{newPostLogo} Create</div>
                    <div onClick={() => navigateProfile()}>
                        <img src={userDoc.photoUrl} alt="profile" id="profile-picture" height={24} width={24}></img>
                        Profile
                    </div>
                </div>
                <div id="more-div">
                    {NavbarMorePopup}
                    <div id='more-button' onClick={() => onMoreClick()}>{moreLogo} More</div>
                </div>
            </div>
        );
    }
};

export default Navbar;