import { useState, useEffect } from "react";

function GetMsgLikesNum(props){

    const [likeNum, setLikeNum] = useState(0);

    useEffect(() => {
        props.firestore
            .collection('posts')
            .doc(props.post.id)
            .collection('messages')
            .doc(props.comment.id)
            .collection('messageLikes')
            .onSnapshot(snapshot => {
                setLikeNum(snapshot.size);
            })
    }, [props.commentLikeStatus])

    return <span className='comment-likenum'>Likes: {likeNum}</span>;
}

export default GetMsgLikesNum;