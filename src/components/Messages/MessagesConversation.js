import React, { useEffect, useState, useRef } from "react";
import { getDocs, query, orderBy, limit, collection, onSnapshot, getCountFromServer, startAfter } from "firebase/firestore";
import { useAuthContext } from "../../context/AuthContext";
import { firestore } from "../../firebase";

const MessagesConversation = (props) => {
    const { setEndLoad, profile } = props;
    const { loggedIn, userData, userDoc } = useAuthContext();
    const [currentMessages, setCurrentMessages] = useState([]);
    const [key, setKey] = useState();
    const messageRef = collection(firestore, "users", userDoc.uid, "messages", profile.uid, 'conversation');
    const bottomRef = useRef(null);

    const renderFirst = async () => {
        //Get first messages
        const querySnapshot = await getDocs(query(messageRef, orderBy('timestamp', 'desc'), limit(20)));
        let newArray = currentMessages;

        querySnapshot.forEach((document) => {
            newArray.unshift({ ...document.data(), id: document.id });
            setCurrentMessages(filterArrayWithId(newArray));
            setKey(document.data().timestamp);
        });
        queryListener();
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
                if (change.type === 'modified' && (index === -1)) {
                    let newArray = currentMessages;
                    newArray.push({ ...change.doc.data(), id: change.doc.id });
                    setCurrentMessages(filterArrayWithId(newArray));
                    const mainDiv = document.querySelector('#messages-area > .main');
                    mainDiv.scrollTo(0, mainDiv.scrollHeight);
                }
            })
        })
    };

    const loadMore = async () => {
        queryListener();
        const snapShotCount = await getCountFromServer(messageRef);
        if ((snapShotCount.data().count - currentMessages.length) < 20) {
            setEndLoad(true);
        } 
        if ((snapShotCount.data().count - currentMessages.length) !== 0) {
            const querySnapshot = await getDocs(query(messageRef, orderBy('timestamp', 'desc'), startAfter(key), limit(20)));
            let newArray = currentMessages;

            querySnapshot.forEach((document) => {
                newArray = [{ ...document.data(), id: document.id }, ...newArray];
                setCurrentMessages(filterArrayWithId(newArray));
                setKey(document.data().timestamp);
            });
        }
        queryListener();
    }

    const handleScroll = () => {
        const mainDiv = document.querySelector('#messages-area > .main');
        if ((mainDiv.scrollTop + mainDiv.offsetHeight) === mainDiv.offsetHeight) {
            let button = document.querySelector('#load-more');
            button.click();
        };
    };

    const onRender = async () => {
        const snapShotCount = await getCountFromServer(messageRef);
        if (snapShotCount.data().count < 20) {
            setEndLoad(true);
        } else {
            setEndLoad(false);
        }
    }

    useEffect(() => {
        const mainDiv = document.querySelector('#messages-area > .main');
        mainDiv.addEventListener('scroll', handleScroll);
        setTimeout(() => bottomRef.current?.scrollIntoView(), 100);

        return () => {
            mainDiv.removeEventListener('scroll', handleScroll);
        }
    }, []);

    useEffect(() => {
        setKey();
        onRender();
        setCurrentMessages([]);
        queryListener();
        setTimeout(() => bottomRef.current?.scrollIntoView(), 100);
        renderFirst();
    }, [profile])

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
            <div ref={bottomRef}></div>
            <button id="load-more" onClick={() => loadMore()} hidden></button>
        </div>
    );
};

export default MessagesConversation;