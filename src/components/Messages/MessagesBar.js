import React, { useState } from "react";
import { addDoc, collection, setDoc, doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase";
import { serverTimestamp } from "firebase/firestore";
import { useAuthContext } from "../../context/AuthContext";

const MessagesBar = (props) => {
    const { profile } = props;
    const { loggedIn, userData, userDoc } = useAuthContext();
    const [sendButton, setSendButton] = useState();
    const [messageContent, setMessageContent] = useState();

    //When message bar value changes, set the message content and detect if send button should appear
    const onChange = (e) => {
        let textValue = e.target.textContent;
        setMessageContent(textValue);

        if (textValue !== '') {
            setSendButton(<div id="send-button" onClick={() => onSendMessage()}>Send</div>);
        } else {
            setSendButton();
        };
    };

    //Detect if message is within the character limit
    const onDown = (e) => {
        let textValue = e.target.textContent;

        if (textValue.length >= 1000) {
            e.preventDefault();
        }
    }

    //Add message to collection
    const addMessageDoc = async (profileConversationRef) => {
        const messageObject = {
            content: messageContent,
            timestamp: serverTimestamp(),
            senderUid: userDoc.uid,
        };

        //Add to user collection
        const messageRef = await addDoc(profileConversationRef, messageObject);
        const id = messageRef.id;

        //Add to other profile collection
        const userConversationRef = doc(firestore, 'users', profile.uid, 'messages', userDoc.uid, 'conversation', messageRef.id);
        await setDoc(userConversationRef, messageObject);

        sendMessageNotification(messageObject, messageRef.id);
    };

    const updateProfileDoc = async (ref, profile) => {
        await setDoc(ref, { ...profile, lastModified: serverTimestamp() });
    };

    const sendMessageNotification = async (messageObject, id) => {
        const notificationsRef = doc(firestore, 'users', profile.uid, 'notifications', id);
        const docSnap = await getDoc(notificationsRef);

        if (docSnap.exists() === false) {
            const NotificationsObject = (type, document, documentId, timestamp, read) => {
                return {
                    type,
                    document,
                    documentId,
                    timestamp,
                    read,
                };
            };
            const object = NotificationsObject('message', messageObject, id, serverTimestamp(), false);
            await setDoc(notificationsRef, object);
        }
    };

    const onSendMessage = async () => {
        //Update profile doc
        const profileRef = doc(firestore, 'users', userDoc.uid, 'messages', profile.uid);
        const userRef = doc(firestore, "users", profile.uid, "messages", userDoc.uid);
        updateProfileDoc(profileRef, profile);
        updateProfileDoc(userRef, userDoc);

        //Add message to profile conversation collection
        const profileConversationRef = collection(firestore, 'users', userDoc.uid, 'messages', profile.uid, 'conversation');
        addMessageDoc(profileConversationRef);

        //Reset Message bar
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