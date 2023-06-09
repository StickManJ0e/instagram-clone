import React, { useEffect, useState } from "react";
import { firestore } from "../../firebase";
import { setDoc, doc, serverTimestamp, collection, addDoc, updateDoc } from "firebase/firestore";
import { useAuthContext } from "../../context/AuthContext";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import '../../styles/post/PostCreateMenu.css';
import PostEdit from "./PostEdit";

const PostCreateMenu = (props) => {
    const { setCurrentPopUp } = props;
    const { loggedIn, userData } = useAuthContext();
    let user = userData;
    const [page, setPage] = useState(1);
    const [previewFile, setPreviewFile] = useState();
    const [selectedFile, setSelectedFile] = useState();
    const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1");

    const createPostAndReturn = () => {
        let caption = document.querySelector('textarea').value;
        let postsRef = collection(firestore, 'posts');
        savePost(caption, postsRef)
            .then(() => {
                exitPopup();
            });
    }

    //Create doc in Users and Post collection
    async function savePost(caption, pathRef) {
        try {
            //Create Doc for Posts collection
            const postRef = await addDoc(pathRef, {
                uid: user.uid,
                fileUrl: 'LOADING_IMAGE_URL',
                caption: caption,
                aspectRatio: selectedAspectRatio,
                timestamp: serverTimestamp(),
            });

            const filePath = `${user.uid}/${postRef.id}/posts/${selectedFile.name}`;
            const newFileRef = ref(getStorage(), filePath);
            const fileSnapshop = await uploadBytesResumable(newFileRef, selectedFile);

            const publicFileUrl = await getDownloadURL(newFileRef);

            await updateDoc(postRef, {
                fileUrl: publicFileUrl,
                storageUri: fileSnapshop.metadata.fullPath
            });

            //Duplicate doc for user
            let docRef = doc(firestore, 'users', user.uid, 'posts', postRef.id);
            await setDoc(docRef, {
                uid: user.uid,
                fileUrl: publicFileUrl,
                storageUri: fileSnapshop.metadata.fullPath,
                caption: caption,
                aspectRatio: selectedAspectRatio,
                timestamp: serverTimestamp(),
            })
        } catch (error) {
            console.log(error);
        }
    }

    const exitPopup = () => {
        setCurrentPopUp();
    };

    const uploadFileClick = () => {
        let fileInput = document.getElementById('file-input');
        fileInput.click();

        fileInput.addEventListener('change', (e) => {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewFile(reader.result);
            }
            reader.readAsDataURL(e.target.files[0]);
            setSelectedFile(e.target.files[0])
            setPage(2);
        });
    };

    return (
        <div className="post-wrapper">
            <div id="popup-backdrop" onClick={() => exitPopup()}></div>
            <div id="exit-button" onClick={() => exitPopup()}>x</div>
            {page === 1 ?
                <div id="select" className="create-post-div">
                    <div className="Heading">Create new post</div>
                    <label htmlFor="file"></label>
                    <input id='file-input' type='file' name="file" accept="image/jpeg, image/png" hidden />
                    <button onClick={() => uploadFileClick()}>Select From Computer</button>
                </div> :
                <div id="edit" className="create-post-div">
                    <div className="post-header">
                        <button onClick={() => setPage(1)}>Back</button>
                        <div>Create new post</div>
                        <button onClick={() => createPostAndReturn()}>Share</button>
                    </div>
                    <PostEdit imageSrc={previewFile} setSelectedAspectRatio={setSelectedAspectRatio} selectedAspectRatio={selectedAspectRatio} />
                </div>
            }
        </div >
    )
}

export default PostCreateMenu;