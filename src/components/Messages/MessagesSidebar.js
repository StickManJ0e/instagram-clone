import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import MessagesCreateNew from "./MessagesCreateNew";
import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestore } from "../../firebase";
import { useNavigate } from "react-router-dom";

const MessagesSidebar = (props) => {
    const { setCurrentPopUp } = props;
    const { loggedIn, userData, userDoc } = useAuthContext();
    const [conversations, setConversations] = useState([]);
    const navigate = useNavigate();
    const messageRef = collection(firestore, 'users', userDoc.uid, 'messages');

    const onNewMessage = () => {
        setCurrentPopUp(<MessagesCreateNew setCurrentPopUp={setCurrentPopUp} />)
    };

    const getMessages = async () => {
        const querySnapshot = await getDocs(query(messageRef, orderBy('lastModified', 'desc')));
        let newArray = [];

        querySnapshot.forEach((document) => {
            newArray.push(document.data());
            setConversations(newArray);
        })
    };

    const navigateToMessage = (account) => {
        navigate(`/messages/${account.username}`);
    }

    const queryListener = () => {
        onSnapshot(query(messageRef), (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    getMessages();
                }
            })
        })
    }

    useEffect(() => {
        getMessages();
        queryListener();
    }, [])

    return (
        <div id="messages-sidebar">
            <div className="header">
                <div>{userDoc.username}</div>
                <div onClick={() => onNewMessage()}>
                    <svg aria-label="New message" className="new-message-icon" color="var(--mode-text-color)" fill="var(--mode-text-color)" height={24} role="img" viewBox="0 0 24 24" width={24}>
                        <title>New message</title>
                        <path d="M12.202 3.203H5.25a3 3 0 0 0-3 3V18.75a3 3 0 0 0 3 3h12.547a3 3 0 0 0 3-3v-6.952" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}></path>
                        <path d="M10.002 17.226H6.774v-3.228L18.607 2.165a1.417 1.417 0 0 1 2.004 0l1.224 1.225a1.417 1.417 0 0 1 0 2.004Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}></path>
                        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} x1={16.848} x2={20.076} y1={3.924} y2={7.153}></line>
                    </svg>
                </div>
            </div>
            <div className="main">
                <div id="sidebar-profiles">
                    {(conversations !== undefined) ? conversations.map((conversation) => {
                        return (
                            <div key={conversation.uid} className="messages-sidebar-profile" onClick={() => navigateToMessage(conversation)}>
                                <img className="messages-profile-picture" src={conversation.photoUrl} alt="profile" />
                                <div>{conversation.username}</div>
                            </div>
                        )
                    }) : ''}
                </div>
            </div>
        </div>
    );
};

export default MessagesSidebar;