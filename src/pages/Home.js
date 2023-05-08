import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar/Navbar";
import Posts from "../components/Post/Posts";
import '../styles/Home/Home.css'

const Home = (props) => {
    const {setProfileUser} = props;
    const { loggedIn, userData } = useAuthContext();
    const [currentPopUp, setCurrentPopUp] = useState();
    const [currentPosts, setCurrentPosts] = useState([]);
    let user = userData;

    return (
        <div id="main-wrapper">
            <Navbar setCurrentPopUp={setCurrentPopUp} setProfileUser={setProfileUser}/>
            <div id="main">
                <Posts setProfileUser={setProfileUser} currentPosts={currentPosts} setCurrentPosts={setCurrentPosts} setCurrentPopUp={setCurrentPopUp} />
            </div>
            {currentPopUp}
        </div>
    )
}

export default Home;