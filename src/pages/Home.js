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
    const [key, setKey] = useState();
    let user = userData;
    const postRef = collection(firestore, 'posts');

    const filterArrayWithId = (array) => {
        const filteredData = array.filter((value, index, self) =>
            self.findIndex(v => v.docId === value.docId) === index
        );
        return filteredData;
    }

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

        setCurrentPosts(filterArrayWithId(newArray));
    };

    async function fetchData() {
        const querySnapshot = await getDocs(query(postRef, orderBy('timestamp', 'desc'), startAfter(key), limit(2)));
        let newArray = currentPosts;

        querySnapshot.forEach((doc) => {
            newArray.push(postObject(doc.id, doc.data()));
            setKey(doc.data().timestamp);
        });

        setCurrentPosts(newArray)
    };

    const queryListener = () => {
        //Listen for new posts created
        onSnapshot(query(postRef), (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                let index = currentPosts.findIndex((post) => post.docId === change.doc.id);

                //When doc is removed
                if (change.type === 'removed' && index !== -1) {
                    console.log(change.type);
                    let newArray = currentPosts;
                    newArray.splice(index, 1);
                    setCurrentPosts(filterArrayWithId(newArray));
                }

                if (change.type === 'modified' && index === -1) {
                    //When doc is created 
                    let posts = currentPosts;
                    posts = posts.unshift(postObject(change.doc.id, change.doc.data()));
                    setCurrentPosts(posts);
                }

                //When doc is modified 
                if (change.type === 'modified' && index === -1) {
                    let posts = currentPosts;
                    posts[index] = postObject(change.doc.id, change.doc.data());
                    setCurrentPosts(posts);
                }
            });
        });
    }

    useEffect(() => {
        setCurrentPosts([]);
        postFirst();
        queryListener();
    }, []);

    return (
        <div id="main-wrapper">
            <Navbar setCurrentPopUp={setCurrentPopUp} />
            <div id="main">
                <Posts currentPosts={currentPosts} setCurrentPosts={setCurrentPosts} />
                <button onClick={() => fetchData()}>Load More</button>
            </div>
            {currentPopUp}
        </div>
    )
}

export default Home;