import firebase from "firebase/compat/app";
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage"

const firebaseConfig = {
    apiKey: "AIzaSyDIhyA7CsMiytlWwIpU7zD64jMONUPahvg",
    authDomain: "realjardinbotanicoapp.firebaseapp.com",
    projectId: "realjardinbotanicoapp",
    storageBucket: "realjardinbotanicoapp.appspot.com",
    messagingSenderId: "865397111946",
    appId: "1:865397111946:web:389a059a73976c02090173",
    measurementId: "G-KKJJK6H0T0"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

firebase.firestore().settings({ experimentalForceLongPolling: true,merge:true });


export { firebase,db }