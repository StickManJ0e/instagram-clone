import React, { useEffect, useState } from "react";
import { getCountFromServer, collection } from "firebase/firestore";
import { firestore } from "../../firebase";
import PostComments from "./PostComments";
import PostLikeButton from "./PostLikeButton";
import PostAddComment from "./PostAddComment";
import '../../styles/post/PostMenu.css';

const PostComponent = (props) => {
    const { currentPost, postUser } = props;
    const [likeCount, setLikeCount] = useState();

    const getLikes = async () => {
        const snapshot = await getCountFromServer(collection(firestore, 'posts', currentPost.id, 'liked'));
        setLikeCount(snapshot.data().count);
    }

    //Format aspect ratio based on input
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
        getLikes();
    }, [])

    return (
        <div className="post-menu-div post-menu">
            <div className="image-container">
                <img className="post-image" src={currentPost.fileUrl} alt="post" style={getAspectRatio(currentPost.aspectRatio)}></img>
            </div>
            <div className="sidebar">
                <div className="post-header post-menu">
                    <img className="post-profile-picture" src={postUser.photoUrl} alt="profile" />
                    <div>{postUser.username}</div>
                    <div>{postUser.displayName}</div>
                </div>
                <div className="post-messages-div">
                    <div className="post-menu post-caption-container">
                        <img className="post-profile-picture" src={postUser.photoUrl} alt="profile" />
                        <div className="post-menu post-caption-wrapper">
                            <div className="post-caption post-menu"><p><span style={{ fontWeight: 700 }}>{postUser.displayName} </span>{currentPost.caption}</p></div>
                            <div>{getDate(currentPost.timestamp)}</div>
                        </div>
                    </div>
                    <PostComments currentPost={currentPost} getDate={getDate} />
                </div>
                <div className="post-footer post-menu">
                    <div className="post-action-bar post-menu">
                        <PostLikeButton currentPost={currentPost} />
                    </div>
                    <div className="post-likes">{likeCount} Likes</div>
                    <PostAddComment currentPost={currentPost} postUser={postUser} />
                </div>
                <div></div>
            </div>
        </div>
    )
};

export default PostComponent;