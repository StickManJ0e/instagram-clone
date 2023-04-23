import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { firestore } from "../../firebase";
import { collection, orderBy, getDocs, query, limit, startAfter, onSnapshot, getCountFromServer } from "firebase/firestore";
import '../../styles/post/Posts.css'

const Posts = (props) => {
    const { currentPosts, setCurrentPosts } = props;
    const [key, setKey] = useState();
    const [endLoad, setEndLoad] = useState();
    const postRef = collection(firestore, 'posts');
    let location = useLocation();
    let postObject = (docId, docData) => {
        return {
            docId, docData,
        }
    }

    //Filter a given array for unqiue posts based of docId
    const filterArrayWithId = (array) => {
        if (array.length > 0) {
            const filteredData = array.filter((value, index, self) =>
                self.findIndex(v => v.docId === value.docId) === index
            );
            return filteredData;
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
        queryListener();
    };

    //Fetch the next posts starting from last
    async function fetchData() {
        const snapShotCount = await getCountFromServer(postRef);
        if ((snapShotCount.data().count - currentPosts.length) === 1) {
            setEndLoad(<div>Reached End</div>);
        };

        queryListener();
        const querySnapshot = await getDocs(query(postRef, orderBy('timestamp', 'desc'), startAfter(key), limit(2)));
        let newArray = currentPosts;

        querySnapshot.forEach((doc) => {
            newArray.push(postObject(doc.id, doc.data()));
            setKey(doc.data().timestamp);
        });

        setCurrentPosts(newArray);
        queryListener();

    };

    const queryListener = () => {
        //Listen for new posts created
        onSnapshot(query(postRef), (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                let index = currentPosts.findIndex((post) => post.docId === change.doc.id);
                //When doc is removed
                if (change.type === 'removed' && index !== -1) {
                    let newArray = currentPosts;
                    newArray.splice(index, 1);
                    setCurrentPosts(filterArrayWithId(newArray));
                }

                if (change.type === 'modified' && index === -1) {
                    //When doc is created 
                    let posts = currentPosts;
                    posts = posts.unshift(postObject(change.doc.id, change.doc.data()));
                    setCurrentPosts(filterArrayWithId(posts));
                }

                //When doc is modified 
                if (change.type === 'modified' && index !== -1) {
                    let posts = currentPosts;
                    posts[index] = postObject(change.doc.id, change.doc.data());
                    setCurrentPosts(posts);
                }
            });
        });
    }

    const handleScroll = () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            let button = document.querySelector('#load-more');
            button.click();
        }
    }

    const getAspectRatio = (aspectRatio) => {
        let adjustedAspectRation = (aspectRatio === 'orginal') ? { aspectRatio: 'auto' }
            : (aspectRatio === '1:1') ? { aspectRatio: '1/1' }
                : (aspectRatio === '4:5') ? { aspectRatio: '4/5' }
                    : { aspectRatio: '16/9' };

        return adjustedAspectRation;
    }

    useEffect(() => {
        setCurrentPosts([]);
        postFirst();

        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <div>
            <div className="posts-div">
                {(currentPosts.length > 0) ? currentPosts.map((post) => {
                    return (
                        <div key={post.docId} id={post.docId}>
                            <img className="post-image" src={post.docData.fileUrl} alt="post" style={getAspectRatio(post.docData.aspectRatio)}></img>
                        </div>
                    )
                })

                    : <div></div>}
            </div>
            {endLoad}
            <button id="load-more" onClick={() => fetchData()}>Load More</button>
        </div>
    )
}

export default Posts;