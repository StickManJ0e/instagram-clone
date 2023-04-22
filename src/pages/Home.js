import React, { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar/Navbar";
import '../styles/Home/Home.css'

const Home = () => {
    const { loggedIn, userData } = useAuthContext();
    const [currentPopUp, setCurrentPopUp] = useState();
    let user = userData;

    const test = () => {
        console.log(user.displayName);
        console.log(loggedIn);
    }

    return (
        <div id="main-wrapper">
            <Navbar setCurrentPopUp={setCurrentPopUp} />
            <div id="main">
                <button onClick={() => test()}>Test</button>
            </div>
            {currentPopUp}
        </div>
    )
}

export default Home;