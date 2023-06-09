import React, { useState } from "react";
import "../../styles/post/PostEditMenu.css";
import PostEdit from "./PostEdit";
import { firestore } from "../../firebase";
import { doc, updateDoc, collection, getDocs, query } from "firebase/firestore";

const PostEditMenu = (props) => {
    const { setCurrentPopUp, currentPost } = props;
    const [selectedAspectRatio, setSelectedAspectRatio] = useState(currentPost.docData.aspectRatio);

    const exitPopup = () => {
        setCurrentPopUp();
    }

    const updateDocCaptionAndAspectRatio = async (ref, caption, aspectRatio) => {
        await updateDoc(ref, {
            caption: caption,
            aspectRatio: aspectRatio,
        })
    }

    const editPostAndReturn = async () => {
        let caption = document.querySelector('textarea').value;
        const postRef = doc(firestore, "posts", currentPost.docId);
        const userRef = doc(firestore, "users", currentPost.postUser.uid, "posts", currentPost.docId);
        updateDocCaptionAndAspectRatio(postRef, caption, selectedAspectRatio);
        updateDocCaptionAndAspectRatio(userRef, caption, selectedAspectRatio);

        // Edit doc in each user liked collection
        const likedUsersRef = collection(firestore, "posts", currentPost.docId, "liked");
        const likedUsersSnapshot = await getDocs(query(likedUsersRef));
        likedUsersSnapshot.forEach(async (document) => {
            const docRef = doc(firestore, "users", document.data().uid, "liked", currentPost.docId);
            updateDocCaptionAndAspectRatio(docRef, caption, selectedAspectRatio);

        });

        exitPopup();
    }

    return (
        <div className="post-wrapper">
            <div id="popup-backdrop" onClick={() => exitPopup()}></div>
            <div id="exit-button" onClick={() => exitPopup()}>x</div>
            <div className="create-post-div" id="edit">
                <div className="post-header">
                    <button onClick={() => exitPopup()}>Cancel</button>
                    <div>Edit info</div>
                    <button onClick={() => editPostAndReturn()}>Done</button>
                </div>
                <PostEdit imageSrc={currentPost.docData.fileUrl} selectedAspectRatio={selectedAspectRatio} setSelectedAspectRatio={setSelectedAspectRatio} caption={currentPost.docData.caption} />
            </div>
        </div >
    );
};

export default PostEditMenu;