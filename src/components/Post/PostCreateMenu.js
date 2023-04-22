import React, { useEffect, useState } from "react";
import { firestore } from "../../firebase";
import { setDoc, doc, serverTimestamp, collection, addDoc, updateDoc } from "firebase/firestore";
import { useAuthContext } from "../../context/AuthContext";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import '../../styles/post/PostCreateMenu.css'

const PostCreateMenu = (props) => {
    const { setCurrentPopUp } = props;
    const { loggedIn, userData } = useAuthContext();
    let user = userData;
    const [page, setPage] = useState(1);
    const [previewFile, setPreviewFile] = useState();
    const [selectedFile, setSelectedFile] = useState();
    const [divToggle, setDivToggle] = useState(false);
    const [selectedAspectRatio, setSelectedAspectRatio] = useState("1:1");
    const [imageStyle, setImageStyle] = useState({ aspectRatio: '1:1' });

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

            const filePath = `${user.uid}/${postRef.id}/${selectedFile.name}`;
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

    const openDivOptions = () => {
        if (divToggle === false) {
            setDivToggle(true);
        }
        else {
            setDivToggle(false);
        };
    };

    const selectAspectRatio = (e) => {
        setSelectedAspectRatio(e.target.textContent.toLowerCase());
    }

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

    useEffect(() => {
        (selectedAspectRatio === 'original') ? setImageStyle({ aspectRatio: 'auto' }) :
            (selectedAspectRatio === '1:1') ? setImageStyle({ aspectRatio: 1 / 1 }) :
                (selectedAspectRatio === '4:5') ? setImageStyle({ aspectRatio: 4 / 5 }) :
                    setImageStyle({ aspectRatio: 16 / 9 });

        let element = document.querySelector(`[option-value="${selectedAspectRatio}"]`);
        let elements = document.querySelectorAll('#resize-options>div');

        elements.forEach((element) => {
            element.classList.remove('selected');
        })

        if (element !== null) {
            element.classList.add('selected');
        }
    }, [selectedAspectRatio, divToggle])


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
                    <div className="post-main">
                        <div className="image-container">
                            <img id="selected-file" src={previewFile} alt="selected file" style={imageStyle}></img>
                        </div>
                        <div className="editing-container">
                            <label htmlFor="caption"></label>
                            <textarea type="text" id="caption-input" name="caption" placeholder="Write a caption..." maxLength="2200"></textarea>
                            <div className="resize-div">
                                <div id="resize-option-button" onClick={() => openDivOptions()}>Resize</div>
                                {divToggle ?
                                    <div id="resize-options">
                                        <div option-value='original' onClick={(e) => selectAspectRatio(e)}>Original</div>
                                        <div option-value='1:1' onClick={(e) => selectAspectRatio(e)}>1:1</div>
                                        <div option-value='4:5' onClick={(e) => selectAspectRatio(e)}>4:5</div>
                                        <div option-value='16:9' onClick={(e) => selectAspectRatio(e)}>16:9</div>
                                    </div> :
                                    <div></div>}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}

export default PostCreateMenu;