import firebase from 'firebase/app'
import 'firebase/firestore'

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
firebase.initializeApp(firebaseConfig);

export {firebase}