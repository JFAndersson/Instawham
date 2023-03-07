import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState, useEffect } from 'react';
import reportWebVitals from './vitals/reportWebVitals';
import './style/index.css';
import './style/header.css';
import './style/mywham.css';
import './style/stream.css';

// External app components
import SignIn from './components/auth/sign-in';
import PostStream from './components/stream/stream';
import WhamHeader from './components/header/header';
import WhamNav from './components/navs/nav'
import UserWham from './components/mywham/mywham';


// Importing functions from the SDKs
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3kRL488Xx0lcc9lVETT2HxxTBuAEQC2I",
  authDomain: "instawham-demo.firebaseapp.com",
  projectId: "instawham-demo",
  storageBucket: "instawham-demo.appspot.com",
  messagingSenderId: "813206789241",
  appId: "1:813206789241:web:7c375a2893a5ea5acb88a8",
  measurementId: "G-Z5YFYS79C7"
};

//initialize constants
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const storage = firebase.storage();
const firestore = firebase.firestore();

const root = ReactDOM.createRoot(document.getElementById('root'));

function App(){

  const [user] = useAuthState(auth);
  const [authorId, setAuthorId] = useState(null);

  const [myWhamClicked, setMyWhamClicked] = useState(false);
  const [currentStream, setCurrentStream] = useState('');

  const [streams, setStreams] = useState([]);
  const [customStreams, setCustomStreams] = useState([])

  //gets all stream tags
  useEffect(() => {
    firestore
      .collection("streams")
      .orderBy('order', 'asc')
      .onSnapshot(querySnapshot => {
          const streams = [];
          const customStreams = [];
          querySnapshot.forEach(doc => {
            doc.data().custom ? customStreams.push(doc.id) : streams.push(doc.id);
          });
          setStreams(streams);
          setCustomStreams(customStreams);
          setCurrentStream('Recents');
      });
  }, []);

  function SelectedComponent(){
    if (myWhamClicked){
      return <UserWham firestore={firestore} authorId={authorId} />
    }
    else{
      return <PostStream auth={auth} authorId={authorId} setAuthorId={setAuthorId} firebase={firebase} firestore={firestore} currentStream={currentStream} />
    }
  }

  return (
    <div id="wham-dom">
      <div id='dom-filter'></div>
      {user && <WhamNav auth={auth} myWhamClicked={myWhamClicked} setMyWhamClicked={setMyWhamClicked} />}
      {user && !myWhamClicked && <WhamHeader firestore={firestore} storage={storage} auth={auth} streams={streams} customStreams={customStreams} currentStream={currentStream} setCurrentStream={setCurrentStream} authorId={authorId} />}
      {user ? <SelectedComponent /> : <SignIn auth={auth} firebase={firebase} firestore={firestore} />}
    </div>
  );
}

root.render(
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
