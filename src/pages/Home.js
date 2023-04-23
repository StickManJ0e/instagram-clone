import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar/Navbar";
import Posts from "../components/Post/Posts";
import '../styles/Home/Home.css'

const Home = () => {
    const { loggedIn, userData } = useAuthContext();
    const [currentPopUp, setCurrentPopUp] = useState();
    const [currentPosts, setCurrentPosts] = useState([]);
    let user = userData;

    return (
        <div id="main-wrapper">
            <Navbar setCurrentPopUp={setCurrentPopUp} />
            <div id="main">
                <Posts currentPosts={currentPosts} setCurrentPosts={setCurrentPosts} />
            </div>
            {currentPopUp}
        </div>
    )
}

export default Home;