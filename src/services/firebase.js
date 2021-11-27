import * as firebase from "firebase/app";
import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  signInWithRedirect,
  onAuthStateChanged,
  getRedirectResult,
} from "firebase/auth";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDOtvEB7RGXQn4663KQQWJLIxKyIykGGH8",
  authDomain: "friendlychat-7e1f7.firebaseapp.com",
  databaseURL: "https://friendlychat-7e1f7-default-rtdb.firebaseio.com",
  projectId: "friendlychat-7e1f7",
  storageBucket: "friendlychat-7e1f7.appspot.com",
  messagingSenderId: "515354421134",
  appId: "1:515354421134:web:991bff92cb676c86afe6df",
});
import { ref, getDatabase } from "firebase/database";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const database = getDatabase(firebaseApp);
export const usersTableRef = ref(database);
export const currentUser = auth.currentUser;

export const connectionStatus = ref(database, ".info/connected");

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  signInWithRedirect(auth, provider);
};

const redirectResults = () => {
  getRedirectResult(auth)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;
      console.log("redirect results");
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
};
/* 

! danger, does not work 
TODO make it work better 
*/
export const signOutWithGoogle = async () => {
  await updateDoc(doc(firestore, "users", auth.currentUser.uid), {
    isOnline: false,
  });

  await signOut(auth);
  await setUser(null);
};

const authState = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      console.log(uid);
      getRedirectResult(auth)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access Google APIs.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;

          // The signed-in user info.
          const user = result.user;
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
      // ...
    } else {
      // User is signed out
      // ...
    }
  });
};
