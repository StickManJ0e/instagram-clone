import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import InstagramLogo from '../components/Misc/instagram-logo'
import '../styles/sign-in/Sign-In.css';

const SignIn = () => {
    const [redirectHome, setRedirectHome] = useState();

    const signInOnSubmit = (e) => {
        e.preventDefault();
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                signInWithEmailAndPassword(auth, e.target.email.value, e.target.password.value)
                    .then((userCredential) => {
                        setRedirectHome(<Navigate to='/' />)
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            })
    }

    const signInWithGoogle = () => {
        let provider = new GoogleAuthProvider();
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                signInWithPopup(auth, provider)
                    .then((result) => {
                        setRedirectHome(<Navigate to='/' />);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
    }

    return (
        <div className="main-sign-in main">
            {redirectHome}
            <div className="sign-in-div">
                <div id="sign-up-logo">
                    <InstagramLogo height="51px" width="175px" />
                </div>
                <form className="sign-in-form" onSubmit={(e) => signInOnSubmit(e)}>
                    <label htmlFor="email"></label>
                    <input type="email" name="email" id="email" placeholder="Email" required></input>

                    <label htmlFor="password"></label>
                    <input type="password" name="passwrod" id="password" placeholder="Password" required></input>

                    <button id="submit" type="submit">Log in</button>
                </form>
                <div className="or-div">
                    <div className="or-border"></div>
                    <div className="or-text">OR</div>
                    <div className="or-border"></div>
                </div>
                <button id="google-sign-in" onClick={() => signInWithGoogle()}>Log in with Google</button>
            </div>
            <div className="sign-up redirect-div">
                <p>Don't have an account?</p>
                <Link to={'/sign-up'}>Sign up</Link>
            </div>
        </div>
    )
}

export default SignIn;