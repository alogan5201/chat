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
  signOutWithGoogle,
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

const handleSignIn = async () => {
  await setDoc(doc(firestore, "users", auth.currentUser.uid), {
    name: auth.currentUser.displayName,
    uid: auth.currentUser.uid,
    avatar: auth.currentUser.photoURL,
    isOnline: true,
    geoHash: "",
  });
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
        f7.loginScreen.close();
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
/*
onValue(connectionStatus, (snapshot) => {
  if (snapshot.exists()) {
    if (auth.currentUser !== null) {


      console.log(auth.currentUser.uid);
    } else {
      console.log("null");
    }
  } else {
    console.log("does not exist");
  }
});
*/
const MyApp = () => {
  // Login screen demo data
  const [activeTab, setActiveTab] = useState("chats");
  const previousTab = useRef("chats");
  const [user, loading, error] = useAuthState(auth);
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
        <Views tabs className="safe-areas">
          <Toolbar tabbar labels bottom>
            <Link
              tabLink="#view-home"
              iconIos="f7:house_fill"
              iconAurora="f7:house_fill"
              iconMd="material:home"
              text="Home"
              onClick={() => onTabLinkClick("home")}
            />
            <Link
              tabLink="#view-chats"
              tabLinkActive
              iconIos="f7:square_list_fill"
              iconAurora="f7:square_list_fill"
              iconMd="material:view_list"
              text="chats"
              onClick={() => onTabLinkClick("chats")}
            />

            <Link
              tabLink="#view-settings"
              iconIos="f7:gear"
              iconAurora="f7:gear"
              iconMd="material:settings"
              text="Settings"
              onClick={() => onTabLinkClick("settings")}
            />
          </Toolbar>
          <View
            id="view-home"
            onTabShow={() => setActiveTab("home")}
            name="home"
            tab
            url="/"
          />

          <View
            id="view-chats"
            onTabShow={() => setActiveTab("chats")}
            name="chats"
            tab
            tabActive
            url="/chats/"
            main
          />
          <View
            id="view-settings"
            onTabShow={() => setActiveTab("settings")}
            name="settings"
            tab
            url="/settings/"
          />
        </Views>
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

      <LoginScreen id="my-login-screen">
        <View>
          <Page loginScreen>
            <List>
              <LoginScreenTitle> Login</LoginScreenTitle>
              <Button
                color="red"
                raised
                outline
                onClick={() => signOutWithGoogle()}
              >
                Logout
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
        </View>
      </LoginScreen>
    </App>
  );
};

export default MyApp;
