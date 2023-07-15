import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import MessagesSidebar from "../components/Messages/MessagesSidebar";
import MessagesArea from "../components/Messages/MessagesArea";
import '../styles/messages/Messages.css'
import { useParams } from "react-router-dom";

const Messages = (props) => {
    const { setProfileUser } = props;
    const [currentPopUp, setCurrentPopUp] = useState();
    const { id } = useParams();

    const styling = {
        width: 'var(--navbar-narrow-width)',
        minWidth: 'var(--navbar-narrow-width)'
    };

    return (
        <div id="messages-wrapper">
            <Navbar setCurrentPopUp={setCurrentPopUp} setProfileUser={setProfileUser} styling={styling} narrow={true} />
            <div id="messages-main">
                <MessagesSidebar setCurrentPopUp={setCurrentPopUp} />
                <MessagesArea setCurrentPopUp={setCurrentPopUp} id={id}/>
            </div>
            {currentPopUp}
        </div>
    )
}

export default Messages;