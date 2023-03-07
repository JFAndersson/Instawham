function updateAuthorId(auth, firestore, setAuthorId, accountCreated, setAccountCreated) {
    let googleUsername = auth.currentUser.displayName;
    firestore
        .collection("authors")
        .where("nickname", "==", googleUsername)
        .get()
        .then((snapshot) => {
            if (!snapshot.empty) {
                setAuthorId(snapshot.docs[0].id);
            }
            else if (!accountCreated){
                console.log("author doc created");
                const googleProfilePicUrl = auth.currentUser.photoURL;
                firestore
                    .collection('authors')
                    .add({
                        nickname: googleUsername,
                        pfpUrl: googleProfilePicUrl
                    })
                    .then(() => {
                        setAccountCreated(true);
                    });
            }
            else{
                console.log('Fatal error!');
            }
        });
}

export default updateAuthorId;
