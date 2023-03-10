import { useState, useEffect } from 'react';
import { v4 } from 'uuid';
import discardPng from '../../imgs/discard.png';
import sendObjectPng from '../../imgs/send_object.png';
import deleteWhitePng from '../../imgs/delete_white.png';
import notFoundPng from '../../imgs/not_found.png';

function PrintAuthorPosts(props){

    const [userPosts, setUserPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showDeletionModal, setShowDeletionModal] = useState(false);

    useEffect(() => {
        props.firestore
            .collection('authors')
            .doc(props.authorId)
            .collection('posts')
            .onSnapshot((postsSnapshot) => {
                let postsArray = [];
                postsSnapshot.forEach(post => {
                    postsArray.push({ id: post.id, ...post.data() });
                })
                setUserPosts(postsArray);
            })
    }, [])

    function DeletePostModal(props){

        const deletePost = () => {
            props.firestore
                .collection('posts')
                .doc(props.post.id)
                .get()
                .then((post) => {
                    post.ref.delete();
                })
            props.firestore
                .collection('authors')
                .doc(props.authorId)
                .collection('posts')
                .doc(props.post.id)
                .get()
                .then((post) => {
                    post.ref.delete();
                })
            closeModalFunction();
        }

        const closeModalFunction = () => {
            props.closeModal();
            setSelectedPost(null);
            const domFilter = document.getElementById('dom-filter');
            domFilter.classList.remove('active')
        }

        return(
            <div className='header-modal' id="post-deletion-modal">
                <h1>Do you want to delete <span className='postReferenceDeletion'>{props.postHeader}</span>?</h1>
                <div className='cpm-btn-container' id="post-deletion-btns">
                    <button onClick={closeModalFunction}><img className='createPost-icon' src={discardPng} alt='close_window_icon'/>No, go back</button>
                    <button id='uploadTagBtn' onClick={deletePost}><img className='createPost-icon' src={sendObjectPng} alt='upload_post_icon'/>Yes, delete post</button>
                </div>
            </div>
        )
    }

    const showModalFunction = (post) => {
        setShowDeletionModal(true);
        setSelectedPost(post);
        const domFilter = document.getElementById('dom-filter');
        domFilter.classList.add('active')
    }

    function GetPostPreview(props){
        return(
            <div className='post-preview-container'>
                <p className="filterHeader">{props.post.header}</p>
                <div className="post-preview-child-container">
                    <span>likes: {props.post.cachedLikesNum}</span>
                    {props.post.streamTag && <span>tag: {props.post.streamTag}</span>}
                </div>
                <img className="delete-icon" onClick={() => showModalFunction(props.post)} src={deleteWhitePng} alt='remove_post_btn'/>
            </div>
        )
    }
      
    return (
        <div>
            {
                userPosts.length > 0 ? <div className="mywham-parent">
                    {
                        userPosts.map((post, index) => (
                            <div className="myposts-post-container" key={'post-preview:' + v4()}>
                                {showDeletionModal && selectedPost && (
                                    <DeletePostModal firestore={props.firestore} authorId={props.authorId} post={selectedPost} postHeader={selectedPost.header} closeModal={() => setShowDeletionModal(false)} />
                                )}
                                <div id={`post-${index}`} className='postHoverFilter'>
                                    <GetPostPreview post={post}/>
                                </div>
                                <img className="post-thumbnail" src={post.imageUrl} alt="mypost-item" />
                            </div>
                        ))
                    }
                </div>
                :
                <div className='notFoundContainer'>
                    <img src={notFoundPng} alt='not found'/>
                    <p>No posts found</p>
                </div>
            }
        </div>
    )  
}

export default PrintAuthorPosts;