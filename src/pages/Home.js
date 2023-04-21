import React from "react";
import { auth } from "../firebase";
import { useAuthContext } from "../context/AuthContext";

const Home = () => {
    const { loggedIn, userData  } = useAuthContext();
    let user = userData;

    const test = () => {
        console.log(user.displayName);
        console.log(loggedIn);
    }

    return (
        <div>Home
            <button onClick={() => test()}>Test</button>
        </div>
    )
}

export default Home;