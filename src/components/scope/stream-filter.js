function streamFilter(firestore, currentStream){

    let filteredPostsArray = undefined;

    switch (currentStream){
        case 'Recents':
            filteredPostsArray = firestore.collection('posts').orderBy('createdAt', 'desc');
            break;
        case 'Most liked':
            filteredPostsArray = firestore.collection('posts').orderBy('cachedLikesNum', 'desc');
            break;
        default:
            filteredPostsArray = firestore.collection('posts').where('streamTag', '==', currentStream).orderBy('createdAt', 'desc');
            break;
    }

    return filteredPostsArray;
}

export default streamFilter;