import deletePng from '/Users/Fhage/OneDrive/Programmering/Frontend/Instawham/wham-app/src/imgs/delete.png';

function DeleteMessage(props){
    
    const handleDeletion = () => {
        props.firestore
            .collection('posts')
            .doc(props.postId)
            .collection('messages')
            .doc(props.messageId)
            .get()
            .then(message => {
                message.ref.delete();
            })
        props.firestore
            .collection('authors')
            .doc(props.authorId)
            .collection('messages')
            .doc(props.messageId)
            .get()
            .then(message => {
                message.ref.delete();
            })
    }

    return (
        <div className='deleteMsg-container'>
            <img className='deleteMsgBtn' onClick={handleDeletion} src={deletePng} alt='delete_message'/>
        </div>
    )
}

export default DeleteMessage;