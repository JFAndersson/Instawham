import { useState, useEffect } from "react";
import { v4 } from "uuid";

import PrintAuthorTags from "./my-tags";
import PrintAuthorPosts from "./my-posts";
import PrintAuthorComments from "./my-comments"

function UserWham(props){

    const [chosenSubMenu, setChosenSubMenu] = useState('My posts');
    const [userPfp, setUserPfp] = useState(null);
    const [userName, setUserName] = useState(null);
    const menuNameArray = ['My posts', 'My messages', 'My tags'];

    useEffect(() => {
        props.firestore
            .collection('authors')
            .doc(props.authorId)
            .get()
            .then((authorCallback) => {
                setUserPfp(authorCallback.data().pfpUrl);
                setUserName(authorCallback.data().nickname);
            });
    }, [])

    return(
        <div id="mywham-container">
            <div id="mywham-header">
                <img src={userPfp} alt='userPfp' />
                <p>{userName}</p>
            </div>
            <div id="mywham-navigation">
                {menuNameArray.map(subMenu => (
                    <div key={'wrapSub:' + v4()}>                                              
                        <div key={subMenu + ':' + v4()} onClick={() => setChosenSubMenu(subMenu)} style={chosenSubMenu === subMenu ? {fontWeight: 'bold'} : {}}>
                            {subMenu}
                        </div>
                        <div key={'selector:' + v4()} className={chosenSubMenu === subMenu ? 'selectedMenuIndicator selected' : 'selectedMenuIndicator'}></div>
                    </div>
                ))}
            </div>
            <div className='divider-line' id="mywham-navigation-line"></div>
            <div id="submenu-container">
                {chosenSubMenu === 'My posts' && <PrintAuthorPosts firestore={props.firestore} authorId={props.authorId} />}
                {chosenSubMenu === 'My messages' && <PrintAuthorComments firestore={props.firestore} authorId={props.authorId} />}
                {chosenSubMenu === 'My tags' && <PrintAuthorTags firestore={props.firestore} authorId={props.authorId} />}
            </div>
        </div>
    )
}

export default UserWham;