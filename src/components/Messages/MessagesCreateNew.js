import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { firestore } from "../../firebase";
import { collection, query, getDocs, where, limit, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const MessagesCreateNew = (props) => {
    const { setCurrentPopUp } = props;
    const { loggedIn, userData, userDoc } = useAuthContext();
    const [resultAccounts, setResultAccounts] = useState();
    const navigate = useNavigate();

    const exitPopup = () => {
        setCurrentPopUp();
    };

    const onSearch = async (e) => {
        const searchValue = e.target.value;
        //If searchresult empty, return empty results
        if (searchValue === '') {
            setResultAccounts();
            return;
        };

        //Check for results in current users following list
        const followingQuery = query(collection(firestore, "users", userDoc.uid, 'following'), where('username', '>=', searchValue), where('username', '<=', searchValue + '\uf8ff'));
        let querySnapshot = await getDocs(followingQuery);
        //If no results in folliwng list, check reuslts in entire users database
        if (querySnapshot.empty) {
            const userQuery = query(collection(firestore, "users"), where('username', '>=', searchValue), where('username', '<=', searchValue + '\uf8ff'), where('username', '!=', userDoc.username), limit(15));
            querySnapshot = await getDocs(userQuery);
        }

        //If no results overall, return empty results
        if (querySnapshot.empty) {
            setResultAccounts();
            return;
        };

        //If results exists, push all matching accounts into array and set state
        let queryArray = [];
        querySnapshot.forEach((document) => {
            queryArray.push({ ...document.data(), id: document.id });
            setResultAccounts(queryArray);
        });
    };

    const onCreate = async (account) => {
        const profileRef = doc(firestore, 'users', userDoc.uid, 'messages', account.id);
        await setDoc(profileRef, { ...account, lastModified: serverTimestamp() });
        navigate(`/messages/${account.username}`);
        setCurrentPopUp();
    }

    return (
        <div id="messages-create-new-wrapper">
            <div id="popup-backdrop" onClick={() => exitPopup()}></div>
            <div id="exit-button" onClick={() => exitPopup()}>x</div>
            <div id="messages-create-new-main">
                <div className="header">
                    <div>New message</div>
                    <div class="exit-button" onClick={() => exitPopup()}>x</div>
                </div>
                <div className="searchbar">
                    <label htmlFor="contact-searchbar">To:</label>
                    <input id="contact-searchbar" type="text" placeholder="Search..." name="contact-searchbar" onChange={(e) => onSearch(e)}></input>
                </div>
                <div className="search-results">
                    {resultAccounts ? resultAccounts.map((account) => {
                        return (
                            <div key={account.id} className="search-account" onClick={() => onCreate(account)}>
                                <img className="search-profile-picture" src={account.photoUrl} alt="profile" />
                                <div>{account.username}</div>
                            </div>
                        )
                    }) : <div>No account found.</div>}
                </div>
            </div>
        </div>
    );
};

export default MessagesCreateNew;