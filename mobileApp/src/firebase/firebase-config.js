import firebase from "firebase/compat/app";
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage"
// import { Firestore } from 'firebase/firestore';

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

// console.log(app);

const db = firebase.firestore();

firebase.firestore().settings({ experimentalForceLongPolling: true,merge:true });
// export const PlantsRef = db.collection("Plants");

export { firebase,db }