import { useState, useEffect } from 'react';
import { v4 } from 'uuid';

import formatTimestamp from '../../scope/format-timestamp';
import MessageLikeFramework from '../messageLikes/messageLikes';
import ToggleMessagesBtn from './toggleMsgsBtn';
import DeleteMessage from './deleteMsg';
import CreateMessage from './createMsg';

function MessageThread(props) {

    const [messages, setMessages] = useState(null);
    const [showAllMessages, setShowAllMessages] = useState(false);
    const { authorId } = props;
    
    useEffect(() => {
        props.firestore
            .collection('posts')
            .doc(props.post.id)
            .collection('messages')
            .orderBy('createdAt', 'asc')
            .onSnapshot(async messagesSnapshot => {
                var messages = await Promise.all(messagesSnapshot.docs.map(async messageDoc => {
                    const authorId = messageDoc.data().authorId;
                    const commentId = messageDoc.id;
                    const authorSnapshot = await props.firestore.collection('authors').doc(authorId).get();
                    return {
                        id: commentId,
                        authorId: authorId,
                        authorNickname: authorSnapshot.data().nickname,
                        authorPfp: authorSnapshot.data().pfpUrl,
                        text: messageDoc.data().text,
                        createdAt: messageDoc.data().createdAt
                    };
                }));
                setMessages(messages);
            })
    }, [])

    const checkIfYourMessage = (firestore, postId, messageId, authorId) => {
        return firestore
            .collection('posts')
            .doc(postId)
            .collection('messages')
            .doc(messageId)
            .onSnapshot(snapshot => {
                try{
                    return snapshot.data().authorId == authorId ? true : false;
                }
                catch (error){
                    //console.log(error)
                }
            });
    }
    
    const messageFormat = (message) => {
        return (
            <div className='comment-container' key={"comment-container:"+v4()}>
                <div className='comment-author'>
                    <div className='comment-pfp-child'>
                        <img className='pfpImage' src={message.authorPfp} alt="author pfp" />
                    </div>
                    <div className='comment-author-child'>
                        <div className='author-comment-div'>
                            <span className='comment-nickname'>{message.authorNickname}</span>
                            <div className='message-status-container'>
                                <span className='comment-time'>{formatTimestamp(message.createdAt.toDate(), 'short')},</span>
                                <MessageLikeFramework
                                    authorId={authorId}
                                    decision={'msgLikeNum'}
                                    firestore={props.firestore} 
                                    post={props.post} 
                                    comment={message} 
                                    />
                                {
                                    checkIfYourMessage(props.firestore, props.post.id, message.id, authorId)
                                    && <DeleteMessage 
                                            firestore={props.firestore} 
                                            authorId={authorId}
                                            postId={props.post.id} 
                                            messageId={message.id}
                                            />
                                }
                            </div>
                        </div>
                        <span className='comment-text'>{message.text}</span>
                    </div>
                </div>
                <MessageLikeFramework
                    authorId={authorId}
                    decision={'msgLikeBtn'}
                    firestore={props.firestore} 
                    post={props.post} 
                    comment={message} 
                    />
            </div>
        )
    }

    return (
        <div className='comment-thread'>
            <CreateMessage firestore={props.firestore} authorId={authorId} post={props.post} />
            {messages && messages ? messages.slice(0, 3).map(message => messageFormat(message)) : <div>Loading...</div>}
            {messages && messages.length > 3 && <ToggleMessagesBtn messages={messages} showAllMessages={showAllMessages} setShowAllMessages={setShowAllMessages} />}
            {messages && messages.length > 3 && showAllMessages && (
                <div className='remaining-comments'>
                    {messages.slice(3).map(message => messageFormat(message))}
                </div>
            )}
        </div>
    );    
}

export default MessageThread;