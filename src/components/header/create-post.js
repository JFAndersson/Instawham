import { useState, useEffect } from 'react';
import { v4 } from 'uuid';
import discardPng from '../../imgs/discard.png';
import sendObjectPng from '../../imgs/send_object.png';

function CreatePostModal(props) {

    const [isComplete, setIsComplete] = useState(false);
    const [customTags, setCustomTags] = useState(null)

    const [image, setImage] = useState(null);
    const [header, setHeader] = useState('');
    const [body, setBody] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);

    useEffect(() => {
        props.firestore
            .collection('streams')
            .where('custom', '==', true)
            .get()
            .then(tagSnapshot => {
                const tagData = [];
                tagData.push('no tag')
                tagSnapshot.forEach(doc => {
                    tagData.push(doc.id);
                });
                setCustomTags(tagData);
            });
    }, []);

    useEffect(() => {
        if (image != null && header != '' && selectedTag != ''){
            setIsComplete(true);
            const uploadBtn = document.getElementById('uploadPostBtn');
            uploadBtn.disabled = false;
            uploadBtn.classList.remove('disabled');
        }
        else{
            if (isComplete){
                setIsComplete(false);
            }
            if (!document.getElementById('uploadPostBtn').disabled){
                const uploadBtn = document.getElementById('uploadPostBtn');
                uploadBtn.disabled = true;
                uploadBtn.classList.add('disabled');
            }
        }
    }, [image, header, body, selectedTag])

    const closeModalFunction = () => {
        props.closeModal();
        const domFilter = document.getElementById('dom-filter');
        domFilter.classList.remove('active')
    }
  
    const handleCreatePost = async () => {
        if (isComplete){
            const storageRef = props.storage.ref();
            const imageRef = storageRef.child(`userUploads/${image.name}`);
            await imageRef.put(image);
            const imageUrl = await imageRef.getDownloadURL();
            const newPostId = v4();
            props.firestore
                .collection('authors')
                .doc(props.authorId)
                .collection('posts')
                .doc(newPostId)
                .set({
                    authorId: props.authorId,
                    header: header,
                    body: body,
                    streamTag: selectedTag,
                    imageUrl: imageUrl,
                    createdAt: new Date(),
                });
            props.firestore
                .collection('posts')
                .doc(newPostId)
                .set({
                    authorId: props.authorId,
                    header: header,
                    body: body,
                    streamTag: selectedTag,
                    imageUrl: imageUrl,
                    createdAt: new Date(),
                });
            closeModalFunction();
        }
    };
  
    return (
      <div className='header-modal'>
        <h1>Create a post</h1>
        <div className='cpm-input-container'>
            <input className='inputFile' type="file" onChange={e => setImage(e.target.files[0])} />
            <input className='inputHeader' type="text" placeholder="A header..." onChange={e => setHeader(e.target.value)} />
            <textarea placeholder="Some text..." onChange={e => setBody(e.target.value)} />
            <select value={selectedTag != null ? selectedTag : 'loading...'} onChange={e => setSelectedTag(e.target.value)}>
                {customTags && customTags.map(tag => {
                    if (tag === 'no tag'){
                        return <option key={tag} value={tag}>{tag}</option>;
                    } 
                    else{
                        return <option key={tag} value={tag}>Tag: {tag}</option>;
                    }
                })}
            </select>
        </div>
        <div className='cpm-btn-container'>
            <button onClick={closeModalFunction}><img className='createPost-icon' src={discardPng} alt='close_window_icon'/>Close window</button>
            <button id='uploadPostBtn' onClick={handleCreatePost}><img className='createPost-icon' src={sendObjectPng} alt='upload_post_icon'/>Upload post</button>
        </div>
      </div>
    );
}

export default CreatePostModal;