import React, { useState } from "react";
import { addDoc, collection, setDoc, doc } from "firebase/firestore";
import { firestore } from "../../firebase";
import { serverTimestamp } from "firebase/firestore";
import { useAuthContext } from "../../context/AuthContext";

const MessagesBar = (props) => {
    const { profile } = props;
    const { loggedIn, userData, userDoc } = useAuthContext();
    const [sendButton, setSendButton] = useState();
    const [messageContent, setMessageContent] = useState();

    const onChange = (e) => {
        let textValue = e.target.textContent;
        setMessageContent(textValue);

        if (textValue !== '') {
            setSendButton(<div id="send-button" onClick={() => onSendMessage()}>Send</div>);
        } else {
            setSendButton();
        };
    };

    const onDown = (e) => {
        let textValue = e.target.textContent;

        if (textValue.length >= 1000) {
            e.preventDefault();
        }
    }

    const addMessageDoc = async (profileConversationRef) => {
        const messageRef = await addDoc(profileConversationRef, {
            content: messageContent,
            timestamp: serverTimestamp(),
            senderUid: userDoc.uid,
        });

        const userConversationRef = doc(firestore, 'users', profile.uid, 'messages', userDoc.uid, 'conversation', messageRef.id);
        await setDoc(userConversationRef, {
            content: messageContent,
            timestamp: serverTimestamp(),
            senderUid: userDoc.uid,
        })

    };

    const updateProfileDoc = async (ref, profile) => {
        await setDoc(ref, { ...profile, lastModified: serverTimestamp() });
    }

    const onSendMessage = async () => {
        //Update profile doc
        const profileRef = doc(firestore, 'users', userDoc.uid, 'messages', profile.uid);
        const userRef = doc(firestore, "users", profile.uid, "messages", userDoc.uid);
        updateProfileDoc(profileRef, profile);
        updateProfileDoc(userRef, userDoc);

        //Add message to profile conversation collection
        const profileConversationRef = collection(firestore, 'users', userDoc.uid, 'messages', profile.uid, 'conversation');
        addMessageDoc(profileConversationRef);

        const textArea = document.querySelector('.textarea');
        textArea.textContent = '';
    }

    return (
        <div id="message-bar-wrapper">
            <div id="message-bar">
                <p class="textarea" role="textbox" contentEditable="true" maxlength="1000" onKeyDown={(e) => onDown(e)} onKeyUp={(e) => onChange(e)}></p>
                {sendButton}
            </div>
        </div >
    )
}

export default MessagesBar;