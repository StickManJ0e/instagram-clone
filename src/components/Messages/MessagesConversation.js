import React, { useEffect, useState } from "react";
import { getDocs, query, orderBy, limit, collection, onSnapshot } from "firebase/firestore";
import { useAuthContext } from "../../context/AuthContext";
import { firestore } from "../../firebase";

const MessagesConversation = (props) => {
    const { profile } = props;
    const { loggedIn, userData, userDoc } = useAuthContext();
    const [currentMessages, setCurrentMessages] = useState([]);
    const messageRef = collection(firestore, "users", userDoc.uid, "messages", profile.uid, 'conversation');

    const renderFirst = async () => {
        //Get first messages
        const querySnapshot = await getDocs(query(messageRef, orderBy('timestamp', 'desc'), limit(12)));
        let newArray = currentMessages;

        querySnapshot.forEach((document) => {
            newArray.unshift({ ...document.data(), id: document.id });
            setCurrentMessages(filterArrayWithId(newArray));
        });
    };

    //Filter a given array for unqiue posts based of docId
    const filterArrayWithId = (array) => {
        if (array.length > 0) {
            const filteredData = array.filter((value, index, self) =>
                self.findIndex(v => v.id === value.id) === index
            );
            return filteredData;
        }
    }

    const queryListener = () => {
        onSnapshot(query(messageRef), (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                let index = currentMessages.findIndex((message) => message.id === change.doc.id);
                console.log(change.type)
                // console.log(change.doc.id);
                if (change.type === 'added' && (index === -1)) {
                    let newArray = currentMessages;
                    newArray.push({ ...change.doc.data(), id: change.doc.id });
                    setCurrentMessages(filterArrayWithId(newArray));
                }
            })
        })
    }

    useEffect(() => {
        setCurrentMessages([]);
        queryListener();
        return () => {
            renderFirst();
        }
    }, []);

    useEffect(() => {
        queryListener();
        queryListener();
        // console.log(currentMessages);
    }, [currentMessages])

    return (
        <div className="conversation">
            {(currentMessages) ? currentMessages.map((message) => {
                if (message.senderUid === userDoc.uid) {
                    return (
                        <div key={message.id} className="user message">{message.content}</div>
                    )
                } else {
                    return (
                        <div key={message.id} className="profile message">{message.content}</div>
                    )
                }
            }) : ''}
        </div>
    );
};

export default MessagesConversation;