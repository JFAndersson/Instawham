import { useState, useEffect } from 'react';
import streamFilter from '../scope/stream-filter'
import formatTimestamp from '../scope/format-timestamp';

import updateAuthorId from './onLoad/updAuthorId';
import updatePostLikeCount from './onLoad/updPostLikeCount';
import MessageThread from './messageThread/messageThread';
import PostLikeFramework from './postLikes/postLikes';

import notFoundPng from '/Users/Fhage/OneDrive/Programmering/Frontend/Instawham/wham-app/src/imgs/not_found.png';

function PostStream(props) {

    const {authorId, setAuthorId} = props;
    const [postsData, setPostsData] = useState([]);
    const [accountCreated, setAccountCreated] = useState(false);

    useEffect(() => {
        // sets firestore reference
        let postsRef = streamFilter(props.firestore, props.currentStream);
        // acquires the user's authorId
        updateAuthorId(props.auth, props.firestore, setAuthorId, accountCreated, setAccountCreated);
        // sets the posts data
        postsRef.onSnapshot(async (postsSnapshot) => {
            const newPostsPromises = postsSnapshot.docs.map(async (doc) => {
                // updates each post's cached likeNum
                updatePostLikeCount(props.firestore, authorId, doc.id, false);
                //retreive post-author's info
                const postAuthor = await props.firestore.collection('authors').doc(doc.data().authorId).get();
                return {
                    id: doc.id,
                    postAuthor: postAuthor.data(),
                    ...doc.data()
                }
            });
            const newData = await Promise.all(newPostsPromises);
            setPostsData(newData);
        });
    }, []);

    //#region system

    function PostTags(props){
        const tag = props.post.streamTag;
        if (tag){
            return <p className='post-body tags'>streamTag: <span className='bold-tag'>{tag}</span></p>
        }
    }

    function StreamTime(props){
        const getTime = () => {
            const currentTime = new Date();
            return currentTime.toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit', hour12: false});
        }
        return <p className={props.isInvisible === false ? 'session-indicator' : 'session-indicator invisible'}>Updated: {getTime()}</p>;
    }

    //#endregion

    return (
        <div id='stream-container'>
            {postsData.length > 0 ? <StreamTime isInvisible={false} /> : <StreamTime isInvisible={true} />}
            {
                postsData.length > 0 ? postsData.map(post => (
                    <div id='post-container-wrap'>
                        <div className='post-container' key={post.id}>
                            <div className='post-reference'>  
                                <div className='post-reference-author'>
                                    <p>From:</p> 
                                    <img className='pfpImage' src={post.postAuthor.pfpUrl ? post.postAuthor.pfpUrl : 'https://qph.cf2.quoracdn.net/main-qimg-654617264f9192ec976abe6e53356240-lq'} alt='author pfp'/> 
                                    <p>{post.postAuthor.nickname}</p>
                                </div>
                                <p>{formatTimestamp(post.createdAt.toDate())}</p>
                            </div>
                            <img className='post-image' src={post.imageUrl} alt="Post image" />
                            <div className='post-header'>
                                <h1>{post.header}</h1>
                                <div id='interaction-container'>
                                    <div className="likeBtnWrapper">
                                        <PostLikeFramework 
                                            firestore={props.firestore}
                                            authorId={authorId}
                                            decision='postLikeBtn'
                                            postId={post.id}
                                            />
                                    </div>
                                    <PostLikeFramework 
                                        firestore={props.firestore}
                                        authorId={authorId}
                                        decision='postLikeNum'
                                        postId={post.id}
                                        />
                                </div>
                            </div>
                            {post.body && <p className='post-body'>{post.body}</p>}
                            <PostTags post={post} />
                            <MessageThread firestore={props.firestore} post={post} authorId={authorId} />
                        </div>
                        <div className='divider-line post-divider'></div>
                    </div>
                ))
                :
                <div className='notFoundContainer'>
                    <img src={notFoundPng} alt='not found'/>
                    <p>No posts found</p>
                </div>
            }
        </div>
    )
}

export default PostStream;