import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase";
import { getDocs, query, orderBy, limit, collection, getDoc, doc, onSnapshot } from "firebase/firestore";

const PostCommentsPreview = (props) => {
    const { currentPost, postUser } = props;
    const [previewComments, setPreviewComments] = useState([]);
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
        setPreviewComments(filterArrayWithId(array));
    }

    const firstComment = async () => {
        //Get first posts
        const querySnapshot = await getDocs(query(commentRef, orderBy('timestamp', 'asc'), limit(2)));
        let newArray = previewComments;

        querySnapshot.forEach((document) => {
            setQueryData(newArray, document);
        });
    };

    useEffect(() => {
        firstComment();
    })
    return (
        <div className="post-comments-div">
            {previewComments.map((comment) => {
                return (
                    <div className="post-comment-preview">
                        <p><span style={{ fontWeight: 700 }}>{comment.commentUser.username} </span>{comment.comment}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default PostCommentsPreview;