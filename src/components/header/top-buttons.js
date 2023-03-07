import { useState } from 'react';
import CreatePostModal from './create-post';
import createPostPng from '/Users/Fhage/OneDrive/Programmering/Frontend/Instawham/wham-app/src/imgs/create_post.png';
import hideCustomPng from '/Users/Fhage/OneDrive/Programmering/Frontend/Instawham/wham-app/src/imgs/hide_custom.png';
import showCustomPng from '/Users/Fhage/OneDrive/Programmering/Frontend/Instawham/wham-app/src/imgs/show_custom.png';

function TopButtons(props){

    const [showPostModal, setShowPostModal] = useState(false);

    const showPostModalFunction = () => {
        setShowPostModal(true);
        const domFilter = document.getElementById('dom-filter');
        domFilter.classList.add('active');
    }

    return (
        <div id='action-grid'>
            <div className="grid-item">
                <button onClick={showPostModalFunction} className="action-header-button" role="button"><img className='actionBtn-icon' src={createPostPng} alt='create_btn'/>Create a post</button>
            </div>
            <div className="grid-item">
                {props.viewCustomStreams ? 
                    <button onClick={() => props.setViewCustomStreams(false)} className="action-header-button" id='hide-streams-btn' role="button"><img className='actionBtn-icon' src={hideCustomPng} alt='hide_c-streams_icon'/>Hide custom streams</button>
                    :
                    <button onClick={() => props.setViewCustomStreams(true)} className="action-header-button" role="button"><img className='actionBtn-icon' src={showCustomPng} alt='show_c-streams_icon'/>Show custom streams</button>
                }
            </div>
            {showPostModal && 
                <CreatePostModal 
                    firestore={props.firestore} 
                    storage={props.storage} 
                    authorId={props.authorId} 
                    closeModal={() => setShowPostModal(false)} 
                    />}
        </div>
    )
}

export default TopButtons;