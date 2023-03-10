import { useState, useEffect } from 'react';
import discardPng from '../../imgs/discard.png';
import sendObjectPng from '../../imgs/send_object.png';

function CreateTagModal(props){

    const [isComplete, setIsComplete] = useState(false);
    const [existingTags, setExistingTags] = useState(null);
    const [placeHolderText, setPlaceHolderText] = useState('New tag name')

    const [newTagName, setNewTagName] = useState('');

    useEffect(() => {
        props.firestore
            .collection('streams')
            .get()
            .then(tagSnapshot => {
                const tagData = [];
                tagSnapshot.forEach(doc => {
                    tagData.push(doc.id);
                });
                setExistingTags(tagData);
            });
    }, []);

    useEffect(() => {
        if (newTagName != ''){
            setIsComplete(true);
            const uploadTag = document.getElementById('uploadTagBtn');
            uploadTag.disabled = false;
            uploadTag.classList.remove('disabled');
        }
        else{
            if (isComplete){
                setIsComplete(false);
            }
            if (!document.getElementById('uploadTagBtn').disabled){
                const uploadTag = document.getElementById('uploadTagBtn');
                uploadTag.disabled = true;
                uploadTag.classList.add('disabled');
            }
        }
    }, [newTagName])

    const closeModalFunction = () => {
        props.closeModal();
        const domFilter = document.getElementById('dom-filter');
        domFilter.classList.remove('active')
    }

    const handleCreateTag = () => {
        if (isComplete && !existingTags.includes(newTagName)){
            props.firestore
                .collection('streams')
                .doc(newTagName)
                .set({
                    custom: true,
                    tagAuthorId: props.authorId,
                    order: 3
                })
            closeModalFunction();  
        }
        else{
            setPlaceHolderText('Tag already exists');
            document.getElementById('inputTagBox').value = null;
            setTimeout(() => {
                setPlaceHolderText('New tag name');
            }, 2000);
        }
    }

    return(
        <div className='header-modal'>
            <h1>Create a tag</h1>
            <div className='cpm-input-container'>
                {placeHolderText === 'New tag name' ? 
                    <input className='inputTag' id='inputTagBox' type="text" placeholder={placeHolderText} onChange={e => setNewTagName(e.target.value)} />
                    :
                    <input className='inputTag inputError' type="text" placeholder={placeHolderText} onChange={e => setNewTagName(e.target.value)} />
                }    
            </div>
            <div className='cpm-btn-container'>
                <button onClick={closeModalFunction}><img className='createPost-icon' src={discardPng} alt='close_window_icon'/>Close window</button>
                <button id='uploadTagBtn' onClick={handleCreateTag}><img className='createPost-icon' src={sendObjectPng} alt='upload_post_icon'/>Upload tag</button>
            </div>
        </div>
    )
}

export default CreateTagModal;