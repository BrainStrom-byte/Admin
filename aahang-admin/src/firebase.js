// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyCBwa6xyqjKsIMZEwli5nFt2jy4CSKHb_U",
    authDomain: "aahang-63cff.firebaseapp.com",
    databaseURL: "https://aahang-63cff.firebaseio.com",
    projectId: "aahang-63cff",
    storageBucket: "aahang-63cff.appspot.com",
    messagingSenderId: "724090479412",
    appId: "1:724090479412:web:100c0db8e8a09209bf3b61",
    measurementId: "G-YN2L34QCV6"
  };

 firebase.initializeApp(firebaseConfig);

 export const firebaseAuth = firebase.auth();

 export const firestore = firebase.firestore();

 export const storageRef = firebase.storage().ref();

 export default firebase;