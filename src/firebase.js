import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCrKxT36qA3jLmHcAM-sWHHxoGFAkPDlzU",
    authDomain: "e-commerce-5f537.firebaseapp.com",
    projectId: "e-commerce-5f537",
    storageBucket: "e-commerce-5f537.appspot.com",
    messagingSenderId: "629091866911",
    appId: "1:629091866911:web:880e116bb903804331382a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
