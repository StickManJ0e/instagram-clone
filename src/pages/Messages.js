import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import '../styles/messages/Messages.css'

const Messages = (props) => {
    const { setProfileUser } = props;
    const [currentPopUp, setCurrentPopUp] = useState();

    return (
        <div className="messages-wrapper">
            <Navbar setCurrentPopUp={setCurrentPopUp} setProfileUser={setProfileUser} />
            <div className="messages-main">
                Messages
            </div>
            {currentPopUp}
        </div>
    )
}

export default Messages;