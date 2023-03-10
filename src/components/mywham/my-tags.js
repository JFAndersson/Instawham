import { useState, useEffect } from 'react';
import { v4 } from 'uuid';
import discardPng from '../../imgs/discard.png';
import sendObjectPng from '../../imgs/send_object.png';
import deleteWhitePng from '../../imgs/delete_white.png';
import notFoundPng from '../../imgs/not_found.png';

function PrintAuthorTags(props){

    const [userTags, setUserTags] = useState([]);

    const [showDeletionModal, setShowDeletionModal] = useState(false);
    const [selectedTagDeletion, setSelectedTagDeletion] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const tagsSnapshot = await props.firestore // Vänta på resultatet från Firestore
                .collection('streams')
                .where('tagAuthorId', '==', props.authorId)
                .get(); // Hämta alla matchande dokument
    
            const tagData = await Promise.all( // Vänta på att alla löften i arrayen har fullförts
                tagsSnapshot.docs.map(async tagDoc => { // Mappa över varje dokument
                    const postsSnapshot = await props.firestore // Vänta på resultatet från Firestore
                        .collection('posts')
                        .where('streamTag', '==', tagDoc.id)
                        .get(); // Hämta alla matchande dokument
    
                    return {tagName: tagDoc.id, taggedCount: postsSnapshot.size}; // Returnera data för varje tag
                })
            );
    
            setUserTags(tagData); // Uppdatera state med resultaten
        };
        getData();
    }, []);

    function DeleteTagModal(props){
        const deleteTag = () => {
            props.firestore
                .collection('streams')
                .doc(props.tagName)
                .get()
                .then((post) => {
                    post.ref.delete();
                })
            props.firestore
                .collection('posts')
                .where('streamTag', '==', props.tagName)
                .get()
                .then((postsSnapshot) => {
                    postsSnapshot.forEach((post) => {
                        post.ref.update({
                            streamTag: null
                        })
                    })
                })
            closeModalFunction();
        }
        const closeModalFunction = () => {
            props.closeModal();
            setSelectedTagDeletion(null);
            const domFilter = document.getElementById('dom-filter');
            domFilter.classList.remove('active')
        }
        return(
            <div className='header-modal' id="tag-deletion-modal">
                <h1>Do you want to delete <span className='postReferenceDeletion'>{props.tagName}</span>?</h1>
                <p>Note that this will remove the tag from all associated posts</p>
                <div className='cpm-btn-container' id="post-deletion-btns">
                    <button onClick={closeModalFunction}><img className='createPost-icon' src={discardPng} alt='close_window_icon'/>No, go back</button>
                    <button id='uploadTagBtn' onClick={deleteTag}><img className='createPost-icon' src={sendObjectPng} alt='upload_post_icon'/>Yes, delete tag</button>
                </div>
            </div>
        )
    }

    const showModalFunction = (tagName) => {
        setShowDeletionModal(true);
        setSelectedTagDeletion(tagName);
        const domFilter = document.getElementById('dom-filter');
        domFilter.classList.add('active')
    }
    
    return (
        <div>
            {
                userTags.length > 0 ? <div className="mywham-parent">
                    {userTags && userTags.map((tagData) => (
                        <div className="mytags-tag-container" key={'tag-preview:' + v4()}>
                            {showDeletionModal && selectedTagDeletion && (
                                <DeleteTagModal firestore={props.firestore} authorId={props.authorId} tagName={selectedTagDeletion} closeModal={() => setShowDeletionModal(false)} />
                            )}
                            <div className='mytags-data'>
                                <span>{tagData.taggedCount} tagged posts</span>
                                <span>{tagData.tagName}</span>
                            </div>
                            <img className="delete-icon tag-deletion" onClick={() => showModalFunction(tagData.tagName)} src={deleteWhitePng} alt='remove_post_btn'/>
                        </div>
                    ))}
                </div>
                :
                <div className='notFoundContainer'>
                    <img src={notFoundPng} alt='not found'/>
                    <p>No tags found</p>
                </div>
            }
        </div>
    )
}

export default PrintAuthorTags;