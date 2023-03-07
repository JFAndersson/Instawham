import { useEffect } from 'react';

function SignIn(props) {

  useEffect(() => {
    // listen for changes in the auth state
    props.auth.onAuthStateChanged(async user => {
      if (user) {
        // check if a document for the user already exists in the "authors" collection
        const snapshot = await props.firestore.collection('authors').where('nickname','==',user.displayName).get();
        if (snapshot.empty) {
          // create a new document for the user if one does not already exist
          props.firestore.collection('authors').add({
            nickname: user.displayName,
            pfpUrl: user.photoURL
          });
        }
      }
    });
  }, []);

  const signInWithGoogle = () => {
    const provider = new props.firebase.auth.GoogleAuthProvider();
    props.auth.signInWithPopup(provider);
  }

  const spanStyle = {
    'fontStyle': 'italic'
  }

  return (
    <div id='signin-container'>
      <div id='welcome-container'>
        <p>Welcome to <span style={spanStyle}>Instawham™</span></p>
      </div>
      <button id="signin-button" onClick={signInWithGoogle} role="button">Sign in with Google</button>
      <p id="signin-terms"> &lt; Do not violate the community guidelines or you will be banned for life! /&gt;</p>
    </div>
  )
}

export default SignIn;