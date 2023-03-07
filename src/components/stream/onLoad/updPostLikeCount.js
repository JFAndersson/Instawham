async function updatePostLikeCount(firestore, authorId, postId, updateAuthorStored){

    if (!authorId || !postId){
        return null;
    }

    const postsRefPublic = firestore.collection('posts');
    const postsRefPrivate = firestore.collection('authors').doc(authorId).collection('posts');

    const public_likesSnapshot = await postsRefPublic.doc(postId).collection('likes').get();
    const cachedLikesNum = public_likesSnapshot.size;
    postsRefPublic.doc(postId).update({ cachedLikesNum });

    //checks if the current user has created the post, and if so also updates the private instance of it
    const postIsUserCreated = await postsRefPrivate.doc(postId).get().then((postSnapshot) => postSnapshot.exists);
    if (postIsUserCreated) {
        postsRefPrivate.doc(postId).update({ cachedLikesNum });
    }
}

export default updatePostLikeCount;