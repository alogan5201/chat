import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import { getDevice } from "framework7/lite-bundle";
import {
  f7,
  f7ready,
  App,
  Panel,
  Views,
  View,
  Popup,
  Page,
  Navbar,
  Toolbar,
  NavRight,
  Link,
  Block,
  BlockTitle,
  LoginScreen,
  LoginScreenTitle,
  List,
  Button,
  ListItem,
  ListInput,
  ListButton,
  BlockFooter,
  useStore,
} from "framework7-react";
import $ from "dom7";
import store from "../js/store";

import capacitorApp from "../js/capacitor-app";
import routes from "../js/routes";

import {
  auth,
  signInWithGoogle,
  database,
  connectionStatus,
  firestore,
} from "../services/firebase";
import {
  onAuthStateChanged,
  getRedirectResult,
  GoogleAuthProvider,
} from "firebase/auth";
import { ref, set, onValue } from "firebase/database";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Geohash from "latlon-geohash";
import HaversineGeolocation from "haversine-geolocation";
const handleSignIn = async () => {
  const currentUser = auth.currentUser;
  const data = await HaversineGeolocation.isGeolocationAvailable();
  const currentPoint = {
    latitude: data.coords.latitude,
    longitude: data.coords.longitude,
    accuracy: data.coords.accuracy,
  };
  if (data) {
    let lat = currentPoint.latitude;
    let lng = currentPoint.longitude;
    const geohash = Geohash.encode(lat, lng, 4);

    await setDoc(doc(firestore, "users", auth.currentUser.uid), {
      name: auth.currentUser.displayName,
      uid: auth.currentUser.uid,
      avatar: auth.currentUser.photoURL,
      isOnline: true,
      geoHash: geohash,
    });
  } else {
    await setDoc(doc(firestore, "users", auth.currentUser.uid), {
      name: auth.currentUser.displayName,
      uid: auth.currentUser.uid,
      avatar: auth.currentUser.photoURL,
      isOnline: true,
      geoHash: "",
    });
  }
};

onAuthStateChanged(auth, (user) => {
  //const { userctx, setUser } = useContext(UserContext);
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User

    getRedirectResult(auth)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        const uid = user.uid;

        const displayName = user.displayName;
        const email = user.email;
        const photoURL = user.photoURL;
        const emailVerified = user.emailVerified;

        handleSignIn();
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
  } else {
    // User is signed out
    // ...
    console.log("user signed out");
  }
});
const MyApp = () => {
  // Login screen demo data
  const [activeTab, setActiveTab] = useState("chats");
  const previousTab = useRef("chats");
  const [user, loading, error] = useAuthState(auth);
  const [loginScreenOpened, setLoginScreenOpened] = useState(false);
  const device = getDevice();
  useEffect(() => {
    // Fix viewport scale on mobiles
    if ((f7.device.ios || f7.device.android) && f7.device.standalone) {
      const viewPortElement = document.querySelector('meta[name="viewport"]');
      viewPortElement.setAttribute(
        "content",
        `${viewPortElement.getAttribute(
          "content"
        )}, maximum-scale=1, user-scalable=no`
      );
    }
  }, []);
  // Framework7 Parameters
  const f7params = {
    name: "My App", // App name
    theme: "auto", // Automatic theme detection

    id: "io.framework7.myapp", // App bundle ID
    // App store
    store: store,
    // App routes
    routes: routes,
    // Register service worker (only on production build)
    serviceWorker:
      process.env.NODE_ENV === "production"
        ? {
            path: "/service-worker.js",
          }
        : {},
    // Input settings
    input: {
      scrollIntoViewOnFocus: device.capacitor,
      scrollIntoViewCentered: device.capacitor,
    },
    // Capacitor Statusbar settings
    statusbar: {
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
    },
  };

  f7ready(() => {
    // Init capacitor APIs (see capacitor-app.js)
    if (f7.device.capacitor) {
      capacitorApp.init(f7);
    }

    if (user) {
      console.log("theres a user");
    } else if (!user) {
      console.log("theres no user");
      f7.loginScreen.open();
    }
    // Call F7 APIs here
  });
  function onTabLinkClick(tab) {
    if (previousTab.current !== activeTab) {
      previousTab.current = activeTab;
      return;
    }
    if (activeTab === tab) {
      $(`#view-${tab}`)[0].f7View.router.back();
    }
    previousTab.current = tab;
  }

  return (
    <App {...f7params}>
      {/* Left panel with cover effect*/}
      <Panel left cover themeDark>
        <View>
          <Page>
            <Navbar title="Left Panel" />
            <Block>Left panel content goes here</Block>
          </Page>
        </View>
      </Panel>

      {/* Right panel with reveal effect*/}
      <Panel right reveal themeDark>
        <View>
          <Page>
            <Navbar title="Right Panel" />
            <Block>Right panel content goes here</Block>
          </Page>
        </View>
      </Panel>

      {user ? (
        <View main className="safe-areas" url="/" />
      ) : loading ? (
        <div>
          <p>Initialising User...</p>
        </div>
      ) : error ? (
        <div>
          <p>Error: {error}</p>
        </div>
      ) : (
        <Views main className="safe-areas">
          <Page loginScreen>
            <List>
              <LoginScreenTitle> Login</LoginScreenTitle>
              <Button raised outline onClick={() => signInWithGoogle()}>
                Google Signin
              </Button>
            </List>

            <List>
              <BlockFooter>
                Test
                <br />
                Click "Sign In" to close Login Screen
              </BlockFooter>
            </List>
          </Page>
        </Views>
      )}

      {/* Popup */}
      <Popup id="my-popup">
        <View>
          <Page>
            <Navbar title="Popup">
              <NavRight>
                <Link popupClose>Close</Link>
              </NavRight>
            </Navbar>
            <Block>
              <p>Popup content goes here.</p>
            </Block>
          </Page>
        </View>
      </Popup>
    </App>
  );
};

export default MyApp;
