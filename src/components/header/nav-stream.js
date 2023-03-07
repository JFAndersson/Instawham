import { useState } from 'react';
import CreateTagModal from './create-tag';
import { v4 } from 'uuid';
import addCustomPng from '/Users/Fhage/OneDrive/Programmering/Frontend/Instawham/wham-app/src/imgs/add_custom.png';

function StreamNav(props){

    const [showTagModal, setShowTagModal] = useState(false);

    const showTagModalFunction = () => {
        setShowTagModal(true);
        const domFilter = document.getElementById('dom-filter');
        domFilter.classList.add('active');
    }

    // asigns the clicked streamLink the class 'clicked-stream' and removes it from any previously clicked link
    const handleClick = (index, isCustom) => {
        let streamsArray = undefined;
        isCustom ? streamsArray = props.customStreams : streamsArray = props.streams;
        streamsArray.forEach(stream => {
            if (document.getElementById(index).innerText != stream && document.getElementById(stream).classList.contains('clicked-stream')){
                document.getElementById(stream).classList.remove('clicked-stream');
            }
            else{
                document.getElementById(index).classList.add('clicked-stream');
                props.setCurrentStream(index);
            }
        })
    }

    // renders the (either custom or main) streamLinks and determines if any of them are already clicked
    const streamLinkFormat = (stream, isCustom) => {

        let handleClickVar = undefined;
        isCustom ? handleClickVar = () => handleClick(stream, true) : handleClickVar = () => handleClick(stream, false);

        return (
            <div key={'wrapStream:' + v4()}>
                {stream === props.currentStream ?
                    <div onClick={handleClickVar} key={stream} className='clicked-stream' id={stream}>{stream}</div>
                    :
                    <div onClick={handleClickVar} key={stream} id={stream}>{stream}</div>
                }
                <div key={'selector:' + v4()} className={stream === props.currentStream ? 'selectedMenuIndicator selected' : 'selectedMenuIndicator'}></div>
            </div>
        )
    }

    // renders the (either custom or main) stream link containers
    return(
        <div className='streamNav-parent'>
            {
                props.viewCustomStreams ? 
                <div className='streamNav-container' id='custom-streamNav-container'>
                    {
                        props.customStreams.map(stream => {
                            return streamLinkFormat(stream, true);
                        })
                    }
                    <div className='add_streamTag-container'>
                        <img className='actionBtn-icon' onClick={showTagModalFunction} src={addCustomPng} alt='hide_c-streams_icon'/>
                    </div>
                    {showTagModal && 
                        <CreateTagModal 
                            firestore={props.firestore} 
                            authorId={props.authorId} 
                            closeModal={() => setShowTagModal(false)} 
                            />}
                </div>
                :
                <div className='streamNav-container' id='main-streamNav-container'>
                    {
                        props.streams.map(stream => {
                            return streamLinkFormat(stream, false);
                        })
                    }
                </div>
            }
        </div>
    )
}

export default StreamNav;