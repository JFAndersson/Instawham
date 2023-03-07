import { useState, useEffect } from 'react';
import GetPostLikesNum from './getPostLikes';
import heartPng from '/Users/Fhage/OneDrive/Programmering/Frontend/Instawham/wham-app/src/imgs/heart.png';
import heartFilledPng from '/Users/Fhage/OneDrive/Programmering/Frontend/Instawham/wham-app/src/imgs/heart_filled.png';

function PostLikeFramework(props) {

    const [likeStatus, setLikeStatus] = useState(null);
    const {postId, decision, authorId} = props;

    useEffect(() => {
        if (authorId){
            props.firestore
                .collection("authors")
                .doc(authorId)
                .collection("liked posts")
                .where("postId", "==", postId)
                .get()
                .then((snapshot) => {
                    if (snapshot.empty) {
                        setLikeStatus(true);
                    } else {
                        setLikeStatus(false);
                    }
                });
        }
        else {
            console.log("No documents found for that username.");
        }
    }, []);

    function handleLikeClick(decision) {
        if (decision === "like" && authorId) {
            props.firestore
                .collection("authors")
                .doc(authorId)
                .collection("liked posts")
                .add({ postId });
            props.firestore
                .collection("posts")
                .doc(postId)
                .collection("likes")
                .add({ authorId });
            setLikeStatus(false);
        }
        else if (decision === "unlike" && authorId) {
            props.firestore
                .collection("authors")
                .doc(authorId)
                .collection("liked posts")
                .where("postId", "==", postId)
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        doc.ref.delete();
                    });
                });
            props.firestore
                .collection("posts")
                .doc(postId)
                .collection("likes")
                .where("authorId", "==", authorId)
                .get().then((snapshot) => {
                    snapshot.forEach((doc) => {
                        doc.ref.delete();
                    });
                });
            setLikeStatus(true);
        }
    }

    if (decision === 'postLikeBtn'){
        return (
            <img
                className='likeBtn' 
                onClick={likeStatus ? () => handleLikeClick("like") : () => handleLikeClick("unlike")} 
                src={likeStatus ? heartPng : heartFilledPng}
                alt={likeStatus ? 'heart' : 'heart_filled'}
                />
        )
    }
    else if (decision === 'postLikeNum'){
        return(
            <GetPostLikesNum 
                firestore={props.firestore}
                postId={postId}
                likeStatus={likeStatus}
                />
        )
    }
}    

export default PostLikeFramework;