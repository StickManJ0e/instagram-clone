import React, { useEffect, useState } from "react";
import MessagesCreateNew from "./MessagesCreateNew";
import { firestore } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import MessagesBar from "./MessagesBar";
import MessagesConversation from "./MessagesConversation";

const MessagesArea = (props) => {
    const { setCurrentPopUp, id } = props;
    const [profile, setProfile] = useState();
    const navigate = useNavigate();

    const onNewMessage = () => {
        setCurrentPopUp(<MessagesCreateNew setCurrentPopUp={setCurrentPopUp} />)
    };

    const getProfile = async () => {
        const profileQuery = query(collection(firestore, "users"), where("username", "==", id));
        const querySnapshot = await getDocs(profileQuery);
        let userData;
        querySnapshot.forEach((document) => {
            userData = document.data();
        });
        setProfile(userData);
    };

    const onProfileClick = (account) => {
        navigate(`/profile/${account.username}`);
    }

    useEffect(() => {
        getProfile();
    }, [id])


    if (profile === undefined) {
        return (
            <div id="messages-area">
                <div>Your messages</div>
                <div>Send private photos and messages to a friend or group</div>
                <div onClick={() => onNewMessage()}>Send message</div>
            </div>
        )
    } else {
        return (
            <div id="messages-area">
                <div className="header">
                    <img className="messages-profile-picture" src={profile.photoUrl} alt="profile" />
                    <div>{profile.username}</div>
                </div>
                <div className="main">
                    <div className="profile">
                        <img className="messages-profile-picture" src={profile.photoUrl} alt="profile" />
                        <div>{profile.displayName}</div>
                        <div className="username">{profile.username} · Instagram</div>
                        <div className="button" onClick={() => onProfileClick(profile)}>View Profile</div>
                    </div>
                    <MessagesConversation profile={profile}/>
                </div>
                <MessagesBar profile={profile} />
            </div>
        );
    }

};

export default MessagesArea;