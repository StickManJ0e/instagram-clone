import React from "react";

const Posts = (props) => {
    const { currentPosts } = props;

    return (
        <div className="posts-div">
            {(currentPosts.length > 0) ? currentPosts.map((post) => {
                return (
                    <div key={post.docId}>{post.docId}</div>
                )
            })

                : <div></div>}
        </div>
    )
}

export default Posts;