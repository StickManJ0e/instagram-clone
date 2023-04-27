import React, { useCallback, useEffect, useState } from "react";
import { firestore } from "../../firebase";
import { collection, orderBy, getDocs, query, limit, startAfter, onSnapshot, getCountFromServer, doc, getDoc } from "firebase/firestore";
import PostLikeButton from "./PostLikeButton";
import '../../styles/post/Posts.css'

const Posts = (props) => {
    const { currentPosts, setCurrentPosts } = props;
    const [key, setKey] = useState();
    const [endLoad, setEndLoad] = useState();
    const [postUsers, setPostUsers] = useState();
    const [postLikes, setPostLikes] = useState();
    const postRef = collection(firestore, 'posts');
    let postObject = (docId, docData, postUser, likeCount) => {
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
        queryListener();
        const snapShotCount = await getCountFromServer(postRef);
        if ((snapShotCount.data().count - currentPosts.length) === 0) {
            setEndLoad(<div>Reached End</div>);
        } else {
            const querySnapshot = await getDocs(query(postRef, orderBy('timestamp', 'desc'), startAfter(key), limit(2)));
            let newArray = currentPosts;

            querySnapshot.forEach((doc) => {
                newArray.push(postObject(doc.id, doc.data()));
                setKey(doc.data().timestamp);
            });

            setCurrentPosts(newArray);
            getUserProfiles();
            getPostLikes();
        }
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
                getUserProfiles();
                getPostLikes();
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

    const getUserProfiles = () => {
        let profileArray = [];

        currentPosts.map(async (post) => {
            const userRef = doc(firestore, 'users', post.docData.uid);
            const docSnap = await getDoc(query(userRef));
            console.log(docSnap.data());
            let postUser = {
                displayName: docSnap.data().displayName,
                email: docSnap.data().email,
                photoUrl: docSnap.data().photoUrl,
                timestamp: docSnap.data().timestamp,
                uid: docSnap.data().uid,
                username: docSnap.data().username,
            };
            profileArray.push(postUser);
            setPostUsers(profileArray);
        })
    };

    //Get Difference between current date and timestamp
    const getDate = (timestamp) => {
        let current = new Date().getTime();
        let alteredTimestamp = new Date((timestamp.seconds * 1000) + (timestamp.nanoseconds / 1000000)).getTime();
        let timeDif = current - alteredTimestamp;

        //Check if timeDif is equal or greater than a day
        if ((timeDif / (1000 * 60 * 60 * 24)) >= 1) {
            return (`${(timeDif / (1000 * 60 * 60 * 24)).toFixed(0)} d`);

            //Check if timeDif is equal or greater than a hour
        } else if ((timeDif / (1000 * 60 * 60)) >= 1) {
            return (`${(timeDif / (1000 * 60 * 60)).toFixed(0)} h`);

            //Return timeDif to the minute
        } else {
            return (`${(timeDif / (1000 * 60)).toFixed(0)} m`);
        };
    };

    //Get Number of likes for each post and put into array
    const getPostLikes = () => {
        let likesArray = [];

        currentPosts.map(async (post) => {
            const snapshot = await getCountFromServer(collection(firestore, 'posts', post.docId, 'liked'));
            let collectionCount = {
                likesNum: snapshot.data().count,
                id: post.docId,
            };

            likesArray.push(collectionCount);
            setPostLikes(likesArray);
        })
    };

    useEffect(() => {
        setCurrentPosts([]);
        postFirst();

        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('scroll', handleScroll);
        }
    }, []);

    useEffect(() => {
        getUserProfiles();
        getPostLikes();
        console.log('change');
    }, [currentPosts]);

    return (
        <div>
            <div className="posts-div">
                {(currentPosts) ? currentPosts.map((post) => {
                    let postUser = undefined;
                    if (postUsers) {
                        let postUserIndex = postUsers.findIndex((user) => user.uid === post.docData.uid);
                        postUser = postUsers[postUserIndex];
                    }

                    let likesCount = undefined;
                    if (postLikes) {
                        let collectionCountIndex = postLikes.findIndex((like) => like.id === post.docId);
                        likesCount = (postLikes[collectionCountIndex]);
                    }

                    return (
                        <div className="post-div" key={post.docId} id={post.docId}>
                            {/* Header */}
                            <div className="post-header">
                                {(postUser !== undefined) ? <img className="post-profile-picture" src={postUser.photoUrl || ''} alt="profile" /> :
                                    <img className="post-profile-picture" src='' alt="profile-" />}
                                {(postUser !== undefined) ? <div className="post-display-name">{postUser.displayName}</div> :
                                    <div className="post-display-name"></div>}

                                <div>{getDate(post.docData.timestamp)}</div>
                            </div>

                            {/* Image */}
                            <img className="post-image" src={post.docData.fileUrl} alt="post" style={getAspectRatio(post.docData.aspectRatio)}></img>

                            {/* Footer */}
                            <div className="post-footer">
                                <div className="post-action-bar">
                                    <PostLikeButton currentPost={post} postUser={postUser} />
                                </div>
                                {(likesCount !== undefined) ? <div className="post-likes">{likesCount.likesNum} Likes</div> :
                                    <div className="post-likes">... Likes</div>}
                                {(postUser !== undefined) ? <div className="post-caption"><p><span style={{ fontWeight: 700 }}>{postUser.displayName} </span>{post.docData.caption}</p></div> :
                                    <div className="post-caption">{post.docData.caption}</div>}
                            </div>

                            {/* Image Mask */}
                            <img className="image-mask" src={post.docData.fileUrl} alt="post"></img>
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