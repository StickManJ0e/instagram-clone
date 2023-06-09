import React from "react";
import '../../styles/post/PostOptions.css'
import { useAuthContext } from "../../context/AuthContext";
import { firestore } from "../../firebase";
import { doc, deleteDoc, query, getDocs, collection } from "firebase/firestore";
import FollowButton from "../Profile/FollowButton";
import PostEditMenu from "./PostEditMenu";
import { useNavigate } from "react-router-dom";

const PostOptions = (props) => {
    const { setCurrentPopUp, currentPost } = props;
    const { loggedIn, userData, userDoc } = useAuthContext();
    const navigate = useNavigate();

    const exitPopup = () => {
        setCurrentPopUp();
    }

    const deletePost = async () => {
        const postRef = doc(firestore, "posts", currentPost.docId);
        const userRef = doc(firestore, "users", currentPost.postUser.uid, "posts", currentPost.docId);
        await deleteDoc(postRef);
        await deleteDoc(userRef);

        //Delete each doc in liked collection in the post doc
        const postLikedRef = collection(firestore, "posts", currentPost.docId, "liked");
        const postLikedSnapshot = await getDocs(query(postLikedRef));
        postLikedSnapshot.forEach(async (document) => {
            const docRef = doc(firestore, "posts", currentPost.docId, "liked", document.id);
            await deleteDoc(docRef);
        })

        // Delete doc in each user liked collection
        const likedUsersRef = collection(firestore, "posts", currentPost.docId, "liked");
        const likedUsersSnapshot = await getDocs(query(likedUsersRef));
        likedUsersSnapshot.forEach(async (document) => {
            const docRef = doc(firestore, "users", document.data().uid, "liked", currentPost.docId);
            await deleteDoc(docRef);
        });

        setCurrentPopUp();
    };

    const editPost = () => {
        setCurrentPopUp(<PostEditMenu setCurrentPopUp={setCurrentPopUp} currentPost={currentPost} />)
    }

    const onGoToPost = () => {
        navigate(`/post/${currentPost.docId}`);
    }

    //If post was created by the current user
    if (currentPost.postUser.uid === userDoc.uid) {
        return (
            <div className="post-options-wrapper">
                <div id="popup-backdrop" onClick={() => exitPopup()}></div>
                <div className="post-options-div">
                    <div onClick={() => deletePost()}>Delete</div>
                    <div onClick={() => editPost()}>Edit</div>
                    <div onClick={() => onGoToPost()}>Go to post</div>
                    <div onClick={() => exitPopup()}>Cancel</div>
                </div>
            </div>
        );
    }

    //If post was createted by another user
    else {
        return (
            <div className="post-options-wrapper">
                <div id="popup-backdrop" onClick={() => exitPopup()}></div>
                <div className="post-options-div">
                    <FollowButton profileUser={currentPost.postUser} />
                    <div>Go to post</div>
                    <div>Copy link</div>
                    <div onClick={() => exitPopup()}>Cancel</div>
                </div>
            </div>
        );
    }
};

export default PostOptions;