import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import { getDocs, query, orderBy, limit, collection, getDoc, doc, onSnapshot } from "firebase/firestore";
import '../../styles/post/PostComments.css';

const PostComments = (props) => {
    const { currentPost, postUser, getDate } = props;
    const [currentComments, setCurrentComments] = useState([]);
    const [key, setKey] = useState();
    const commentRef = collection(firestore, 'posts', currentPost.docId, 'comments');
    let commentObject = (id, uid, comment, timestamp, commentUser) => {
        return { id, uid, comment, timestamp, commentUser };
    }

    //Filter a given array for unqiue posts based of docId
    const filterArrayWithId = (array) => {
        if (array) {
            const filteredData = array.filter((value, index, self) =>
                self.findIndex(v => v.id === value.id) === index
            );
            return filteredData;
        }
        return array;
    }

    const setQueryData = async (array, document) => {
        const userQuery = await getDoc(doc(firestore, 'users', document.data().uid));
        array.push(commentObject(document.id, document.data().uid, document.data().comment, document.data().timestamp, userQuery.data()));
        setCurrentComments(filterArrayWithId(array));
        setKey(document.data().timestamp);
    }

    const firstComment = async () => {
        //Get first posts
        const querySnapshot = await getDocs(query(commentRef, orderBy('timestamp', 'asc')));
        let newArray = currentComments;

        querySnapshot.forEach((document) => {
            setQueryData(newArray, document);
        });
    };

    const queryListener = () => {
        onSnapshot(query(commentRef, orderBy('timestamp', 'asc')), (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (currentComments) {
                    let newArray = currentComments;
                    let index = currentComments.findIndex((comment) => comment.id === change.doc.id);
                    //When doc is removed
                    if (change.type === 'removed' && index !== -1) {
                        newArray.splice(index, 1);
                        setCurrentComments(filterArrayWithId(newArray));
                    };

                    //When doc is created
                    if ((change.type === 'added' || change.type === 'modified') && index === -1) {
                        const setData = async () => {
                            const userQuery = await getDoc(doc(firestore, 'users', change.doc.data().uid));
                            newArray.unshift(commentObject(change.doc.id, change.doc.data().uid, change.doc.data().comment, change.doc.data().timestamp, userQuery.data()));
                            setCurrentComments(filterArrayWithId(newArray));
                        }
                        setData();
                    };

                    if (change.type === 'modified' && index !== -1) {
                        const setData = async () => {
                            const userQuery = await getDoc(doc(firestore, 'users', change.doc.data().uid));
                            newArray[index] = commentObject(change.doc.id, change.doc.data().uid, change.doc.data().comment, change.doc.data().timestamp, userQuery.data());
                            setCurrentComments(filterArrayWithId(newArray));
                        }
                        setData();
                    }
                }
            })
        })
    }

    const handleScroll = () => {
        let scrollDiv = document.querySelector('.post-messages-div');
        if (scrollDiv.scrollTop + scrollDiv.offsetHeight >= scrollDiv.scrollHeight) {
            console.log('end');
        }
    }

    useEffect(() => {
        setCurrentComments([]);
        queryListener();
        firstComment();

        let scrollDiv = document.querySelector('.post-messages-div');
        scrollDiv.addEventListener('scroll', handleScroll);
        return () => {
            scrollDiv.removeEventListener('scroll', handleScroll);
        }
    }, []);

    useEffect(() => {
    }, [currentComments]);

    return (
        <div>
            {currentComments.length ?
                currentComments.map((comment) => {
                    return (
                        <div className="comment-container" key={comment.id} id={comment.id}>
                            <img className="post-profile-picture comment-profile-picture" src={comment.commentUser.photoUrl} alt="profile" />
                            <div className="comment-wrapper">
                                <div><p><span style={{ fontWeight: 700 }}>{comment.commentUser.displayName} </span>{comment.comment}</p></div>
                                <div>{(comment.timestamp !== null) ? getDate(comment.timestamp) :
                                    <div></div>}</div>
                            </div>
                        </div>
                    )
                })
                :
                <div></div>}
        </div>
    );
};

export default PostComments;