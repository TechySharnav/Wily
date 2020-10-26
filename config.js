import * as firebase from "firebase";
require("firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyC7NQsCq48jhfn4HcduE-LJUFqUhv73sVI",
  authDomain: "wilyapp-2e57e.firebaseapp.com",
  databaseURL: "https://wilyapp-2e57e.firebaseio.com",
  projectId: "wilyapp-2e57e",
  storageBucket: "wilyapp-2e57e.appspot.com",
  messagingSenderId: "85351114134",
  appId: "1:85351114134:web:3f11374335d4d1a647a9b7",
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
