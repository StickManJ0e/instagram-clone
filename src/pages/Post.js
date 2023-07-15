import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { firestore } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import Navbar from "../components/Navbar/Navbar";
import PostComponent from "../components/Post/PostComponent";

const Post = (props) => {
    const { setCurrentPopUp } = props;
    const { id } = useParams();
    const [currentPost, setCurrentPost] = useState();
    const [postUser, setPostUser] = useState();

    //Get post data from id param
    const getPost = async () => {
        const postRef = doc(firestore, "posts", id);
        const docSnap = await getDoc(postRef);
        let postData = docSnap.data();
        setCurrentPost({ ...postData, id: id });
        getPostUser(postData.uid);
        console.log({ ...postData, id: id });
    };

    //Get post user data from id param
    const getPostUser = async (uid) => {
        const userRef = doc(firestore, "users", uid);
        const docSnap = await getDoc(userRef);
        let userData = docSnap.data();
        setPostUser(userData);
        console.log(userData);
    };

    useEffect(() => {
        getPost();
    }, [])

    if (currentPost !== undefined && postUser !== undefined) {
        return (
            <div id="post-wrapper">
                <Navbar setCurrentPopUp={setCurrentPopUp} />
                <div id="post-page-wrapper">
                    <PostComponent currentPost={currentPost} postUser={postUser} />
                </div>
            </div>
        );
    };
};

export default Post;