import { useEffect, useState } from 'react';
import StreamNav from './nav-stream';
import TopButtons from './top-buttons';

function WhamHeader(props) {

    const [user, setUser] = useState(null);
    const [viewCustomStreams, setViewCustomStreams] = useState(false);

    useEffect(() => {
        props.auth.onAuthStateChanged(user => {
            setUser(user);
        });
    }, []);

    return(
        <div id="wham-header">
            {user && <p>Welcome, <span id='header-span'>{user.displayName}</span>!</p>}
            <TopButtons 
                firestore={props.firestore} 
                storage={props.storage} 
                authorId={props.authorId} 
                viewCustomStreams={viewCustomStreams} 
                setViewCustomStreams={setViewCustomStreams} 
                />
            <StreamNav 
                firestore={props.firestore} 
                streams={props.streams} 
                authorId={props.authorId} 
                customStreams={props.customStreams} 
                currentStream={props.currentStream}
                setCurrentStream={props.setCurrentStream} 
                viewCustomStreams={viewCustomStreams} 
                setViewCustomStreams={setViewCustomStreams} 
                />
            <div className='divider-line'></div>
        </div>
    )
}

export default WhamHeader;



