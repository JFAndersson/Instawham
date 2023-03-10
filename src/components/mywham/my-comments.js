import { useState, useEffect } from "react";
import formatTimestamp from "../scope/format-timestamp";
import { v4 } from "uuid";
import notFoundPng from '../../imgs/not_found.png';

function PrintAuthorComments(props){

    const [userMessages, setUserMessages] = useState([]);

    useEffect(() => {
        props.firestore
            .collection('posts')
            .get()
            .then((postsSnapshot) => {
                let postsArray = [];
                postsSnapshot.forEach(post => {
                    postsArray.push({id: post.id, imageUrl: post.data().imageUrl});
                })
                if (postsArray) setCommentsHook(postsArray);
            })
    }, []);

    const setCommentsHook = (postsArray) => {
        let dataArray = [];
        Promise.all(
            postsArray.map(postObject =>
                props.firestore
                    .collection('posts')
                    .doc(postObject.id)
                    .collection('messages')
                    .where('authorId', '==', props.authorId)
                    .get()
                    .then((messagesSnapshot) => {
                        dataArray = [
                            ...dataArray,
                            ...messagesSnapshot.docs.map(message => {
                                return({
                                    message: message.data(),
                                    imageUrl: postObject.imageUrl
                                })
                            })
                        ];
                    })
            )
        )
        .then(() => {
            setUserMessages(dataArray);
        });
    };

    return (
        <div>
            {
                userMessages.length > 0 ? <div className="mywham-parent">
                    {userMessages.map((dataObject) => (
                        <div className="mycomments-comment-container" key={'comment-preview:' + v4()}>
                            <div className="mycomments-filter"></div>
                            <img src={dataObject.imageUrl} alt='post-image' />
                            <div className="mycomments-data">
                                <span>{formatTimestamp(dataObject.message.createdAt.toDate(), 'long')}</span>
                                <span>{dataObject.message.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
                :
                <div className='notFoundContainer'>
                    <img src={notFoundPng} alt='not found'/>
                    <p>No comments found</p>
                </div>
            }
            
        </div>
    )
}

export default PrintAuthorComments;