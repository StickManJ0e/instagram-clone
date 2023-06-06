import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { firestore, auth } from "../../firebase";
import { ref, getStorage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SettingsEdit = (props) => {
    const { loggedIn, userData, userDoc } = useAuthContext();
    const [profileSrc, setProfileSrc] = useState();
    const [profileFile, setProfileFile] = useState();
    const [displayNameInput, setDisplayNameInput] = useState(userDoc.displayName);
    const [userBio, setUserBio] = useState();
    const navigate = useNavigate();
    const userRef = doc(firestore, 'users', userDoc.uid);

    const uploadFileClick = () => {
        let fileInput = document.getElementById('file-input');
        fileInput.click();

        fileInput.addEventListener('change', (e) => {
            const reader = new FileReader();
            reader.onload = () => {
                setProfileSrc(reader.result);
            }
            reader.readAsDataURL(e.target.files[0]);
            setProfileFile(e.target.files[0])
        });
    };

    //If bio data is not undefined on render, set UserBio to data
    const setBio = () => {
        if (userDoc.bio !== undefined) {
            setUserBio(userDoc.bio);
        };
    };

    const updateProfilePicture = async () => {
        const filePath = `${userDoc.uid}/${profileFile.name}`;
        const newFileRef = ref(getStorage(), filePath);
        const fileSnapshop = await uploadBytesResumable(newFileRef, profileFile);
        const publicFileUrl = await getDownloadURL(newFileRef);

        await updateDoc(userRef, {
            photoUrl: publicFileUrl,
            storageUri: fileSnapshop.metadata.fullPath,
        });
    }

    const updateUserBio = async () => {
        await updateDoc(userRef, {
            bio: userBio,
        });
    }

    const updateUserDisplayName = async () => {
        await updateDoc(userRef, {
            displayName: displayNameInput,
        });

        updateProfile(auth.currentUser, {
            displayName: displayNameInput,
        })
    }

    const saveChanges = async () => {
        if (profileFile !== undefined) {
            updateProfilePicture();
        };

        if (userBio !== undefined) {
            updateUserBio();
        };

        updateUserDisplayName();

        navigate(`/profile/${userDoc.username}`);
    }

    useEffect(() => {
        setProfileSrc(userDoc.photoUrl);
        setBio();
    }, [])

    return (
        <div className="settings-content edit">
            <div>Edit Profile</div>
            <div className="change-profile-picture">
                <img src={profileSrc} alt="profile" className="settings-profile" />
                <div>
                    <div>{userDoc.username}</div>
                    <input id='file-input' type='file' name="file" accept="image/jpeg, image/png" hidden />
                    <button onClick={() => uploadFileClick()}>Change profile picture</button>
                </div>
            </div>
            <div>
                <label htmlFor="display-name">Display Name</label>
                <textarea type="text" id="display-name-input" name="display-name" value={displayNameInput} maxLength="150" onChange={(e) => setDisplayNameInput(e.target.value)}></textarea>
            </div>
            <div>
                <label htmlFor="bio">Bio</label>
                <textarea type="text" id="bio-input" name="bio" value={userBio} maxLength="150" onChange={(e) => setUserBio(e.target.value)}></textarea>
            </div>
            <button onClick={() => saveChanges()}>Submit</button>
        </div>
    )
}

export default SettingsEdit;