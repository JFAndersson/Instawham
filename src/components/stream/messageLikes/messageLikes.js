import { useState, useEffect } from 'react';
import GetMsgLikesNum from './getMsgLikes';
import heartPng from '/Users/Fhage/OneDrive/Programmering/Frontend/Instawham/wham-app/src/imgs/heart.png';
import heartFilledPng from '/Users/Fhage/OneDrive/Programmering/Frontend/Instawham/wham-app/src/imgs/heart_filled.png';

function MessageLikeFramework(props){

    const [commentLikeStatus, setCommentLikeStatus] = useState(null);
    const { authorId } = props;

    useEffect(() => {
        props.firestore
            .collection('posts')
            .doc(props.post.id)
            .collection('messages')
            .doc(props.comment.id)
            .collection('messageLikes')
            .get()
            .then(snapshot => {
                if (snapshot.size > 0){
                    props.firestore
                        .collection('posts')
                        .doc(props.post.id)
                        .collection('messages')
                        .doc(props.comment.id)
                        .collection('messageLikes')
                        .where("authorId", "==", authorId)
                        .get()
                        .then((snapshot) => {
                            if (snapshot.empty){
                                setCommentLikeStatus(true);
                            }
                            else{
                                setCommentLikeStatus(false);
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
                else{
                    setCommentLikeStatus(true);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleCommentLike = (decision) => {
        if (decision === "like"){
            //adds the like
            props.firestore
                .collection('posts')
                .doc(props.post.id)
                .collection('messages')
                .doc(props.comment.id)
                .collection('messageLikes')
                .add({authorId: authorId})
                .then(() => {
                    setCommentLikeStatus(false);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else if (decision === "unlike"){
            //removes the like
            props.firestore
                .collection('posts')
                .doc(props.post.id)
                .collection('messages')
                .doc(props.comment.id)
                .collection('messageLikes')
                .where("authorId", "==", authorId)
                .get()
                .then((querySnapshot) => {
                    setCommentLikeStatus(true);
                    querySnapshot.forEach(doc => {
                        doc.ref.delete();
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    if (props.decision === 'msgLikeBtn'){
        return(
            <div className='likeMsgBtn-container'>
                <img
                    className='likeMsgBtn' 
                    onClick={commentLikeStatus ? () => handleCommentLike("like") : () => handleCommentLike("unlike")} 
                    src={commentLikeStatus ? heartPng : heartFilledPng}
                    alt={commentLikeStatus ? 'heart' : 'heart_filled'}
                    />
            </div>
        )
    }
    else if (props.decision === 'msgLikeNum'){
        return(
            <GetMsgLikesNum 
                firestore={props.firestore} 
                post={props.post} 
                comment={props.comment} 
                commentLikeStatus={commentLikeStatus} 
                />
        )
    }   
}

export default MessageLikeFramework;