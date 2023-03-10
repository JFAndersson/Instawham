import { useState } from 'react';
import { v4 } from 'uuid';
import addCommentPng from '../../../imgs/add_comment.png';
import discardPng from '../../../imgs/discard.png';
import sendObjectPng from '../../../imgs/send_object.png';

function CreateMessage(props){

    const [showInput, setShowInput] = useState(false);
    const [placeHolderText, setPlaceHolderText] = useState('Your message');
    const [message, setMessage] = useState('');

    const handlePost = () => {
        if (message.length > 0){
            const messageFormat = {
                text: message,
                createdAt: new Date(),
                authorId: props.authorId
            }
            const newMessageId = v4();
            props.firestore
                .collection('posts')
                .doc(props.post.id)
                .collection('messages')
                .doc(newMessageId)
                .set(messageFormat);
            props.firestore
                .collection('authors')
                .doc(props.authorId)
                .collection('messages')
                .doc(newMessageId)
                .set(messageFormat);
            setShowInput(false);
            setMessage('');
        }
        else{
            setPlaceHolderText('No message written');
            setTimeout(() => {
                setPlaceHolderText('Your message');
            }, 2000);
        }
    };

    return (
      <div>
        <div className='create-message-container'>
            <div className='cm-child-container'>
                {!showInput && <button className='actionBtn' onClick={() => setShowInput(!showInput)}><img className='sendMessage-icon' src={addCommentPng} alt='create_msg_icon'/>Create message</button>}
                {showInput && <button className='actionBtn discardMessageBtn' onClick={() => setShowInput(!showInput)}><img className='sendMessage-icon' src={discardPng} alt='discard_icon'/>Discard message</button>}
                {showInput && <button className='actionBtn sendMessageBtn' id={'uploadMessageBtn' + props.post.id} onClick={handlePost}><img className='sendMessage-icon' src={sendObjectPng} alt='send_message_icon'/>Send Message</button>}
            </div>
            <span>Message Thread</span>
        </div>
        {showInput && (
          <div className='textbox-container'>
            {placeHolderText === 'No message written' ? 
                <textarea 
                    className='inputError'
                    value={message}
                    placeholder={placeHolderText}
                    onChange={e => setMessage(e.target.value)}
                />
                :
                <textarea 
                    value={message}
                    placeholder={placeHolderText}
                    onChange={e => setMessage(e.target.value)}
                />
            }
          </div>
        )}
      </div>
    );
}

export default CreateMessage;