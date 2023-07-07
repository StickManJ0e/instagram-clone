import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import { setDoc, doc, serverTimestamp, collection, addDoc, getDoc, query } from "firebase/firestore";
import { useAuthContext } from "../../context/AuthContext";

const PostAddComment = (props) => {
    const { currentPost, postUser } = props;
    const [postDisabled, setPostDisabled] = useState(true);
    const { loggedIn, userData, userDoc } = useAuthContext();

    const onPost = (e) => {
        e.preventDefault();
        let commentText = e.target.comment.value;
        const commentObject = {
            uid: userDoc.uid,
            comment: commentText,
            timestamp: serverTimestamp(),
        };
        createComment(commentObject);
        e.target.reset();
    };

    //Send notification
    const sendCommentNotifictaion = async (commentObject, id) => {
        const notificationsRef = doc(firestore, 'users', currentPost.uid, 'notifications', id);
        const docSnap = await getDoc(query(notificationsRef));
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
            const object = NotificationsObject('comment', commentObject, id, serverTimestamp(), false);
            await setDoc(notificationsRef, object);
        }
    };

    const createComment = async (commentObject) => {
        const postRef = await addDoc(collection(firestore, 'posts', currentPost.id, 'comments'), commentObject);
        await setDoc(doc(firestore, 'users', postUser.uid, 'posts', currentPost.id, 'comments', postRef.id), commentObject);
        sendCommentNotifictaion(commentObject, postRef.id);
    }

    const onInputEdit = (e) => {
        if (e.target.value !== '') {
            setPostDisabled(false);
        } else {
            setPostDisabled(true);
        }
    };

    useEffect(() => {
        let button = document.querySelector('#submit-comment');
        button.disabled = postDisabled;

    }, [postDisabled])

    useEffect(() => {
        //Disable scrolling on rest of document
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'initial';
        }
    }, [])

    return (
        <div>
            <form onSubmit={(e) => onPost(e)}>
                <label htmlFor="comment"></label>
                <input id="comment-input" type="text" name="comment" placeholder="Add a comment" onChange={(e) => onInputEdit(e)}></input>
                <button type="submit" id="submit-comment">Post</button>
            </form>
        </div>
    );
};

export default PostAddComment;