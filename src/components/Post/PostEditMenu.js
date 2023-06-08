import React from "react";
import "../../styles/post/PostEditMenu.css"

const PostEditMenu = (props) => {
    const {setCurrentPopUp} = props;

    const exitPopup = () => {
        setCurrentPopUp();
    }

    return (
        <div className="post-wrapper">
            <div id="popup-backdrop" onClick={() => exitPopup()}></div>
            <div id="exit-button" onClick={() => exitPopup()}>x</div>
            <div id="edit-post-div">
                Edit Post
            </div>
        </div>
    );
};

export default PostEditMenu;