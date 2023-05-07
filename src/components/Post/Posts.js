import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firestore } from "../../firebase";
import { collection, orderBy, getDocs, query, limit, startAfter, onSnapshot, getCountFromServer, doc, getDoc } from "firebase/firestore";
import PostLikeButton from "./PostLikeButton";
import PostMenu from "./PostMenu";
import PostCommentsPreview from "./PostCommentsPreview";
import '../../styles/post/Posts.css'

const Posts = (props) => {
    const { currentPosts, setCurrentPosts, setCurrentPopUp } = props;
    const [key, setKey] = useState();
    const [endLoad, setEndLoad] = useState();
    const postRef = collection(firestore, 'posts');
    let navigate = useNavigate();
    let postObject = (docId, docData, postUser, likeCount) => {
        return {
            docId, docData, postUser, likeCount
        }
    }

    //Set Current Posts on Doc Fetch for Start and Fetch Queries
    const setQueryData = async (newArray, document) => {
        //Get User
        const userRef = doc(firestore, 'users', document.data().uid);
        const docSnap = await getDoc(query(userRef));
        //Get Likes
        const snapshot = await getCountFromServer(collection(firestore, 'posts', document.id, 'liked'));
        newArray.push(postObject(document.id, document.data(), docSnap.data(), snapshot.data().count));
        setKey(document.data().timestamp);
        setCurrentPosts(filterArrayWithId(newArray));
    };

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

        querySnapshot.forEach((document) => {
            setQueryData(newArray, document);
        });
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

            querySnapshot.forEach((document) => {
                setQueryData(newArray, document);
            });
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
                    const getInfo = async () => {
                        let posts = currentPosts;
                        //Get User Info
                        const userRef = doc(firestore, 'users', change.doc.data().uid);
                        const docSnap = await getDoc(query(userRef));

                        //Get Likes
                        const snapshot = await getCountFromServer(collection(firestore, 'posts', change.doc.id, 'liked'));
                        posts = posts.unshift(postObject(change.doc.id, change.doc.data(), docSnap.data(), snapshot.data().count));
                        setCurrentPosts(filterArrayWithId(posts));
                    }
                    getInfo();
                }

                //When doc is modified 
                if (change.type === 'modified' && index !== -1) {
                    const getInfo = async () => {
                        let posts = currentPosts;
                        //Get User Info
                        const userRef = doc(firestore, 'users', change.doc.data().uid);
                        const docSnap = await getDoc(query(userRef));

                        //Get Likes
                        const snapshot = await getCountFromServer(collection(firestore, 'posts', change.doc.id, 'liked'));
                        posts[index] = postObject(change.doc.id, change.doc.data(), docSnap.data(), snapshot.data().count);
                        setCurrentPosts(filterArrayWithId(posts));
                    }
                    getInfo();
                };
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
                {(currentPosts) ? currentPosts.map((post) => {

                    return (
                        <div className="post-div" key={post.docId} id={post.docId}>
                            {/* Header */}
                            <div className="post-header">
                                <img className="post-profile-picture" src={post.postUser.photoUrl} alt="profile" />
                                <div>{post.postUser.username}</div>
                                <div>{getDate(post.docData.timestamp)}</div>
                            </div>

                            {/* Image */}
                            <img className="post-image" src={post.docData.fileUrl} alt="post" style={getAspectRatio(post.docData.aspectRatio)}></img>

                            {/* Footer */}
                            <div className="post-footer">
                                <div className="post-action-bar">
                                    <PostLikeButton currentPost={post} postUser={post.postUser} />
                                </div>
                                <div className="post-likes">{post.likeCount} Likes</div>
                                <div className="post-caption"><p><span style={{ fontWeight: 700 }}>{post.postUser.displayName} </span>{post.docData.caption}</p></div>
                                <div className="view-comments-button" onClick={() =>
                                    setCurrentPopUp(<PostMenu
                                        setCurrentPopUp={setCurrentPopUp} post={post} getAspectRatio={getAspectRatio} getDate={getDate}
                                    />)}>View All Comments</div>
                                <PostCommentsPreview currentPost={post} postUser={post.postUser}/>
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