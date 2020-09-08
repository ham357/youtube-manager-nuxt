import firebase from "firebase/app";
import "firebase/auth"

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyBO92YLQKdEBplboF1pv1BYzDEokYeYvn0",
    authDomain: "manager-c5dbe.firebaseapp.com",
    databaseURL: "https://manager-c5dbe.firebaseio.com",
    projectId: "manager-c5dbe",
    storageBucket: "manager-c5dbe.appspot.com",
    messagingSenderId: "201595439255",
    appId: "1:201595439255:web:8734620f8ca40166eb81d2"
  })
}

export default firebase;
