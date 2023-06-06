import React, { useState } from "react";
import { firestore } from "../firebase";
import { collection } from "firebase/firestore";
import { useAuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar/Navbar";
import Posts from "../components/Post/Posts";
import '../styles/Home/Home.css'

const Home = (props) => {
    const {setProfileUser, currentPopUp, setCurrentPopUp} = props;
    const { loggedIn, userData, userDoc } = useAuthContext();
    const [currentPosts, setCurrentPosts] = useState([]);
    const postRef = collection(firestore, 'posts');

    return (
        <div id="main-wrapper">
            <Navbar setCurrentPopUp={setCurrentPopUp} setProfileUser={setProfileUser}/>
            <div id="main">
                <Posts postType={'home'} postRef={postRef} setProfileUser={setProfileUser} currentPosts={currentPosts} setCurrentPosts={setCurrentPosts} setCurrentPopUp={setCurrentPopUp} />
            </div>
            {currentPopUp}
        </div>
    )
}

export default Home;