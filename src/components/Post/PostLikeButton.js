import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import { setDoc, doc, deleteDoc, getDoc, query } from "firebase/firestore";
import { useAuthContext } from "../../context/AuthContext";
import '../../styles/post/PostLikeButton.css'

const PostLikeButton = (props) => {
    const { loggedIn, userData, userDoc } = useAuthContext();
    const { currentPost, postUser } = props;
    const [liked, setLiked] = useState();
    const [likedHover, setLikedHover] = useState(false);

    const likedSVG = <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 
    1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>;
    const unLikedSVG = <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5
    12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 
    6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0
    3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>;

    const onLike = () => {
        if (liked === false) {
            setLiked(true);
        } else {
            setLiked(false);
        }
    }

    const likePost = async (usersRef, postRef, postUserRef) => {
        //Set Like in Users
        await setDoc(usersRef, {
            uid: currentPost.docData.uid,
            fileUrl: currentPost.docData.fileUrl,
            storageUri: currentPost.docData.storageUri,
            caption: currentPost.docData.caption,
            aspectRatio: currentPost.docData.aspectRatio,
            timestamp: currentPost.docData.timestamp,
        });

        //Set Like in Posts
        await setDoc(postRef, userDoc);

        //Set Like in Post User
        await setDoc(postUserRef, userDoc);
    }

    const unlikePost = async (usersRef, postRef, postUserRef) => {
        await deleteDoc(usersRef);
        await deleteDoc(postRef);
        await deleteDoc(postUserRef)
    }

    const onLikeClick = async () => {
        try {
            const usersRef = doc(firestore, 'users', userData.uid, 'liked', currentPost.docId);
            const postRef = doc(firestore, 'posts', currentPost.docId, 'liked', userData.uid);
            const postUserRef = doc(firestore, 'users', postUser.uid, 'posts', currentPost.docId, 'liked', userData.uid);

            if (liked === true) {
                likePost(usersRef, postRef, postUserRef);
            }
            if (liked === false) {
                unlikePost(usersRef, postRef, postUserRef);
            }
        } catch (error) {
            if (error.message !== "Cannot read properties of undefined (reading 'uid')") {
                console.log(error);
            }
        }
    }

    const checkLiked = async () => {
        const likedRef = doc(firestore, 'users', userData.uid, 'liked', currentPost.docId);
        const docSnap = await getDoc(query(likedRef));
        if (docSnap.exists()) {
            setLiked(true);
            return true;
        } else {
            setLiked(false);
            return false;
        }
    }

    useEffect(() => {
        onLikeClick();
    }, [liked])

    useEffect(() => {
        return () => {
            checkLiked();
        }
    }, [])

    return (
        <button className="like-button" onClick={() => onLike()}>
            {liked ? <svg aria-label="like" color='rgb(255, 48, 64)' fill="rgb(255, 48, 64)" height="24" width="24" role="img" viewBox="0 0 48 48">
                <title>Like</title>
                {likedSVG}
            </svg> :
                (liked === false && likedHover) ?
                    < svg onMouseLeave={() => setLikedHover(false)} aria-label="Unlike" color='rgb(255, 48, 64)' fill="rgb(255, 48, 64)" height="24" width="24" role="img" viewBox="0 0 48 48">
                        <title>Unlike</title>
                        {likedSVG}

                    </svg> :
                    < svg onMouseEnter={() => setLikedHover(true)} aria-label="Unlike" color="rgb(38, 38, 38)" fill="'rgb(38, 38, 38)'" height="24" width="24" role="img" viewBox="0 0 24 24">
                        <title>Unlike</title>
                        {unLikedSVG}
                    </svg>}
        </button >
    )
}

export default PostLikeButton;