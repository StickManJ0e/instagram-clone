import React from "react";
import '../../styles/post/PostMenu.css';
import PostLikeButton from "./PostLikeButton";
import PostAddComment from "./PostAddComment";
import PostComments from "./PostComments";

const PostMenu = (props) => {
    const { setCurrentPopUp, post, getAspectRatio, getDate } = props;

    const exitPopup = () => {
        setCurrentPopUp();
    };

    return (
        <div id="post-menu-wrapper">
            <div id="popup-backdrop" onClick={() => exitPopup()}></div>
            <div id="exit-button" onClick={() => exitPopup()}>x</div>
            <div className="post-menu-div post-menu">
                <div className="image-container">
                    <img className="post-image" src={post.docData.fileUrl} alt="post" style={getAspectRatio(post.docData.aspectRatio)}></img>
                </div>
                <div className="sidebar">
                    <div className="post-header post-menu">
                        <img className="post-profile-picture" src={post.postUser.photoUrl} alt="profile" />
                        <div>{post.postUser.username}</div>
                        <div>{post.postUser.displayName}</div>
                    </div>
                    <div className="post-messages-div">
                        <div className="post-menu post-caption-container">
                            <img className="post-profile-picture" src={post.postUser.photoUrl} alt="profile" />
                            <div className="post-menu post-caption-wrapper">
                                <div className="post-caption post-menu"><p><span style={{ fontWeight: 700 }}>{post.postUser.displayName} </span>{post.docData.caption}</p></div>
                                <div>{getDate(post.docData.timestamp)}</div>
                            </div>
                        </div>
                        <PostComments currentPost={post} postUser={post.postUser} getDate={getDate} />
                    </div>
                    <div className="post-footer post-menu">
                        <div className="post-action-bar post-menu">
                            <PostLikeButton currentPost={post} postUser={post.postUser} />
                        </div>
                        <div className="post-likes">{post.likeCount} Likes</div>
                        <PostAddComment currentPost={post} postUser={post.postUser} />
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    );
};

export default PostMenu;