import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { auth, firestore } from "../firebase";
import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider,
    getAdditionalUserInfo,
    setPersistence,
    browserLocalPersistence,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp, collection, getDocs, query } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import '../styles/sign-in/Sign-Up.css';

const SignUp = () => {
    const [user, setUser] = useState();
    const [signUpMethod, setSignUpMethod] = useState('EmailAndPassword');

    //Update Profile Display Name
    const updateProfileUsername = (user, username) => {
        updateProfile(user, {
            displayName: username,
        }).then(() => {
            saveUser(user);
            setSignUpMethod('RedirectHome');
        }).catch((error) => {
            console.log(error);
        })
    }

    //Add New User to Firestore Database
    const saveUser = async (user) => {
        const userRef = doc(firestore, 'users', user.uid);
        const profileRef = ref(getStorage(), 'assets/profile/default-profile-picture.png');
        let url = await getDownloadURL(profileRef);

        setDoc(userRef, {
            email: user.email,
            uid: user.uid,
            username: user.displayName,
            displayName: user.displayName,
            photoUrl: url,
            timestamp: serverTimestamp(),
        });
    };

    //Create a new account and update profile information using EmailAndPassword
    const createNewEmailAndPasswordUser = (email, password, username) => {
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        setUser(userCredential.user);
                        updateProfileUsername(userCredential.user, username);
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }).catch((error) => {
                console.log(error);
            })
    };

    //Create a new account and update profile information using from inputs
    const onFormSubmit = (e) => {
        e.preventDefault();
        createNewEmailAndPasswordUser(e.target.email.value, e.target.password.value, e.target.username.value);
    }

    //Log in using google
    const onLogInWithGoogle = () => {
        let provider = new GoogleAuthProvider();
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                signInWithPopup(auth, provider)
                    .then((result) => {
                        setUser(result.user);

                        //If displayName isn't set, get username form, if it is, redirect home
                        if (getAdditionalUserInfo(result).isNewUser) setSignUpMethod('Google');
                        else { setSignUpMethod('RedirectHome') };
                    }).catch((error) => {
                        console.log(error);
                    })
            })

    }

    //Update Profile once username is submitted
    const onUsernameSubmit = (e) => {
        e.preventDefault();
        let username = e.target.username.value;
        updateProfileUsername(user, username);
    }

    //Check if inputs in password and confirm password areas are same
    const confirmPassword = (e) => {
        let confirmPasswordVal = e.target.value;
        let passwordVal = e.target.parentElement.password.value;
        if (confirmPasswordVal === passwordVal) {
            e.target.setCustomValidity("");

        } else {
            e.target.setCustomValidity("Passwords Not Matching");
            e.target.reportValidity();
        };
    };

    //Check if username is taken in Firestore
    async function checkUsernameTaken(e) {
        let username = e.target.value;
        const collectionRef = collection(firestore, 'users');
        const querySnapshot = await getDocs(query(collectionRef));
        let usernames = [];
        querySnapshot.forEach((doc) => usernames.push(doc.data().username));
        let taken = (usernames.indexOf(username) === -1) ? false : true;

        if (taken) {
            e.target.setCustomValidity("Username Taken");
            e.target.reportValidity();

        } else {
            e.target.setCustomValidity("");
        };
    };

    return (
        <div className="sign-up main">
            {signUpMethod === 'Google' ?
                <div className="sign-up-div google">
                    <form id="username-form" onSubmit={(e) => onUsernameSubmit(e)}>
                        <div className="username-input-div">
                            <div>@</div>
                            <label htmlFor="username"></label>
                            <input type="text" name="username" id="username" placeholder="Username" onKeyUp={(e) => checkUsernameTaken(e)} required></input>
                        </div>
                        <button type="submit">Sign Up</button>
                    </form>
                </div> :
                signUpMethod === 'EmailAndPassword' ?
                    <div className="sign-up-div email-password">
                        <button onClick={() => onLogInWithGoogle()}>Log in with Google</button>
                        <form id="sign-up-form" onSubmit={(e) => onFormSubmit(e)}>
                            <label htmlFor="email"></label>
                            <input type="email" name="email" id="email" placeholder="Email" required></input>

                            <label htmlFor="username"></label>
                            <input type="text" name="username" id="username" placeholder="Username" onKeyUp={(e) => checkUsernameTaken(e)} required></input>

                            <label htmlFor="password"></label>
                            <input type="password" name="passwrod" id="password" placeholder="Password" required></input>

                            <label htmlFor="confirm-password"></label>
                            <input type="password" name="confirm-password" id="confirm-password" placeholder="Confirm Password" onKeyUp={(e) => confirmPassword(e)} required></input>

                            <button type="submit">Sign Up</button>
                        </form>
                    </div> :
                    <Navigate to='/' />}
            <div className="sign-in redirect-div">
                <p>Have an account?</p>
                <Link to={'/sign-in'}>Log in</Link>
            </div>
        </div>
    )
}

export default SignUp;