import { useState, useEffect } from "react";

function GetPostLikesNum(props){
        
    const [postLikesNum, setPostLikesNum] = useState(0);

    useEffect(() => {
        //Retrieve post likes
        props.firestore
            .collection('posts')
            .doc(props.postId)
            .collection('likes')
            .onSnapshot(snapshot => {
                setPostLikesNum(snapshot.size);
            })
    }, [props.likeStatus])
    
    return <p>{postLikesNum}</p>
}

export default GetPostLikesNum;