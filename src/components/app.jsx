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
  NavRight,
  Link,
  Block,
  LoginScreenTitle,
  List,
  Button,
  BlockFooter,
} from "framework7-react";
import $ from "dom7";
import store from "../js/store";

import capacitorApp from "../js/capacitor-app";
import routes from "../js/routes";

import { auth, signInWithGoogle, firestore } from "../services/firebase";
import {
  onAuthStateChanged,
  getRedirectResult,
  GoogleAuthProvider,
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Geohash from "latlon-geohash";
import HaversineGeolocation from "haversine-geolocation";
import { UserContext } from "../components/UserContext";
function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes;
}

const FiveMinutes = millisToMinutesAndSeconds(300000);

const handleSignIn = async () => {
  //const { user, setUser } = useContext(UserContext);
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
    await setUser({
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
    await setUser({
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
  const [userContext, setUserContext] = useState(null);

  const value = useMemo(
    () => ({ userContext, setUserContext }),
    [userContext, setUserContext]
  );
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
  const getLocation = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
    } else {
      console.log("Locating...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position.coords.latitude);
          console.log(position.coords.longitude);
        },
        () => {
          console.log("Unable to retrieve your location");
        }
      );
    }
  };

  const locationCheckLoop = async () => {
    const data = await HaversineGeolocation.isGeolocationAvailable();
    const currentPoint = {
      latitude: data.coords.latitude,
      longitude: data.coords.longitude,
      accuracy: data.coords.accuracy,
    };

    if (data) {
      /* 
      
        navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position.coords.latitude);
          console.log(position.coords.longitude);
        })
      */

      let lat = currentPoint.latitude;
      let lng = currentPoint.longitude;

      const userGeoLocation = {
        lat: lat,
        lng: lng,
      };

      const result = JSON.stringify(userGeoLocation);
      console.log(result);
      return result;
    } else {
      console.log("user has not given data yet");
    }
  };

  const returnUserLocation = async () => {
    const result = await locationCheckLoop();
    localStorage.setItem("userlocation", result);

    setInterval(function () {
      locationCheckLoop();
    }, 1000000);
  };

  f7ready(() => {
    // Init capacitor APIs (see capacitor-app.js)
    if (f7.device.capacitor) {
      capacitorApp.init(f7);
    }

    if (user) {
      console.log("theres a user");

      // const userGeoLocation = latString.concat("", lngString);
    } else if (!user) {
      console.log("theres no user");
      f7.loginScreen.open();
    }
    // Call F7 APIs here
  });

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
        <UserContext.Provider value={value}>
          <View main className="safe-areas" url="/" />
        </UserContext.Provider>
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
