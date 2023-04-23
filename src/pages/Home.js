import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { firestore } from "../firebase";
import { collection, orderBy, getDocs, query, limit, startAfter, onSnapshot, serverTimestamp, Timestamp } from "firebase/firestore";
import Navbar from "../components/Navbar/Navbar";
import Posts from "../components/Post/Posts";
import '../styles/Home/Home.css'

const Home = () => {
    const { loggedIn, userData } = useAuthContext();
    const [currentPopUp, setCurrentPopUp] = useState();
    const [currentPosts, setCurrentPosts] = useState([]);
    const [pastPosts, setPastPosts] = useState([]);
    const [key, setKey] = useState();
    let user = userData;
    const postRef = collection(firestore, 'posts');

    let postObject = (docId, docData) => {
        return {
            docId, docData,
        }
    }

    async function postFirst() {
        //Get first posts
        const querySnapshot = await getDocs(query(postRef, orderBy('timestamp', 'desc'), limit(2)));
        let newArray = currentPosts;

        querySnapshot.forEach((doc) => {
            newArray.push(postObject(doc.id, doc.data()))
            setKey(doc.data().timestamp);
        });

        setCurrentPosts(newArray);

        //Listen for new posts created
        onSnapshot(query(postRef), (snapshot) => {
            setPastPosts(currentPosts);
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'removed') {
                    let index = currentPosts.findIndex((post) => post.docId === change.doc.id);
                    let newArray = currentPosts;
                    newArray.splice(index, 1);
                    setCurrentPosts(newArray);
                }
                if (change.type === 'modified') {
                    let index = currentPosts.findIndex((post) => post.docId === change.doc.id);
                    if (index === -1) {
                        let posts = currentPosts;
                        posts = posts.unshift(postObject(change.doc.id, change.doc.data()));
                        setCurrentPosts(posts);
                    }
                    else {
                        let posts = currentPosts;
                        posts[index] = postObject(change.doc.id, change.doc.data());
                        setCurrentPosts(posts);
                    }
                };
            });
        });
    };

    async function fetchData() {
        const querySnapshot = await getDocs(query(postRef, orderBy('timestamp', 'desc'), startAfter(key), limit(2)));
        let newArray = currentPosts;

        querySnapshot.forEach((doc) => {
            newArray.push(postObject(doc.id, doc.data()));
            setKey(doc.data().timestamp);
            console.log(doc.id);
        });

        setCurrentPosts(newArray)
    };

    useEffect(() => {
        return () => postFirst();
    }, []);

    return (
        <div id="main-wrapper">
            <Navbar setCurrentPopUp={setCurrentPopUp} />
            <div id="main">
                <Posts currentPosts={currentPosts} pastPosts={pastPosts}/>
                <button onClick={() => fetchData()}>Load More</button>
            </div>
            {currentPopUp}
        </div>
    )
}

export default Home;