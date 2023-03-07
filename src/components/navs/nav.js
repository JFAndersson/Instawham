import { useEffect } from 'react';
import SignOut from '../auth/sign-out';
import streamPng from '/Users/Fhage/OneDrive/Programmering/Frontend/Instawham/wham-app/src/imgs/stream.png';
import streamFilledPng from '/Users/Fhage/OneDrive/Programmering/Frontend/Instawham/wham-app/src/imgs/stream_filled.png'
import myWhamPng from '/Users/Fhage/OneDrive/Programmering/Frontend/Instawham/wham-app/src/imgs/mywham.png';
import myWhamFilledPng from '/Users/Fhage/OneDrive/Programmering/Frontend/Instawham/wham-app/src/imgs/mywham_filled.png'

function WhamNav(props){

    useEffect(() => {
        navResize();
    }, []);
    
    const navResize = () => {

        const nav = document.getElementById("nav-container");
        const nav_items = document.getElementsByClassName('nav-item');
        const navHeight = nav.clientHeight;
        
        function handleScroll(){
            if (window.scrollY > navHeight) {
                nav.classList.add("fixed-nav");
                nav.classList.add('border-bottom');
            } else {
                nav.classList.remove("fixed-nav");
                nav.classList.remove('border-bottom');
            }
            if (window.scrollY > 300){
                nav.classList.add("smallText");
                for (let i = 0; i < nav_items.length; i++){
                    nav_items[i].classList.add('smallText');
                }
            }
            else {
                nav.classList.remove("smallText");
                for (let i = 0; i < nav_items.length; i++){
                    nav_items[i].classList.remove('smallText');
                }
            }
        }

        window.addEventListener("scroll", handleScroll);
    }

    const style = {
        'fontStyle': 'italic',
        'fontWeight': '500'
    }

    return (
        <div id='nav-container'>
            <ul className="nav-item" id="timer-ul">
                <li onClick={() => props.setMyWhamClicked(false)} style={style}>Instawham!</li>
            </ul>
            <ul className="nav-item" id="nav-ul">
                <li onClick={props.myWhamClicked ? () => props.setMyWhamClicked(false) : null}><img className='nav-icon' src={props.myWhamClicked ? streamPng : streamFilledPng} alt={props.myWhamClicked ? 'stream_icon' : 'filled_stream_icon'}/>Streams</li>
                <li onClick={!props.myWhamClicked ? () => props.setMyWhamClicked(true) : null}><img className='nav-icon' src={!props.myWhamClicked ? myWhamPng : myWhamFilledPng} alt={!props.myWhamClicked ? 'mywham_icon' : 'filled_mywham_icon'}/>My profile</li>
                <SignOut auth={props.auth} />
            </ul>
        </div>
    )
}

export default WhamNav;