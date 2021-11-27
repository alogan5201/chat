import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  createContext,
  useMemo,
} from "react";
import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  NavTitleLarge,
  NavRight,
  Link,
  Toolbar,
  Block,
  BlockTitle,
  List,
  ListItem,
  Row,
  Col,
  Button,
  Stepper,
  f7,
  CardHeader,
  Card,
  CardContent,
  CardFooter,
  Sheet,
  PageContent,
} from "framework7-react";
import People from "../components/People";
import Input from "../components/Input";
import Geohash from "latlon-geohash";
import create from "zustand";
import { auth, firestore } from "../services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import HaversineGeolocation from "haversine-geolocation";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { usePosition } from "../hooks/usePosition";
import { UserContext } from "../components/UserContext";
import { useAuthState } from "react-firebase-hooks/auth";

const HomePage = () => {
  const [user, loading] = useAuthState(auth);

  const { userContext, setUserContext } = useContext(UserContext);
  //console.log(userContext);

  const watch = true;
  const [coords, setCoords] = useState([]);
  const [meetingTime, setRadius] = useState(5);
  const [position, setPosition] = useState({});
  const [error, setError] = useState(null);
  const { latitude, longitude, fourgeohash, threegeohash } = usePosition(
    watch,
    { enableHighAccuracy: true }
  );

  const [currentHash, setCurrentHash] = useState("");
  const myQuery = "?geohash=bar";

  const onChange = ({ coords }) => {
    let lat = coords.latitude;
    let lng = coords.longitude;

    let fourGeohash = Geohash.encode(lat, lng, 4);
    let threeGeohash = Geohash.encode(lat, lng, 4);
    localStorage.setItem(
      "geohash",
      JSON.stringify({
        three: threeGeohash,
        four: fourGeohash,
      })
    );
    // threeGeohash

    localStorage.setItem("fourgeohash", JSON.stringify(fourGeohash));
    setPosition({
      latitude: coords.latitude,
      longitude: coords.longitude,
      fourgeohash: fourGeohash,
      threeGeohash: threeGeohash,
    });
  };
  const onError = (error) => {
    setError(error.message);
  };

  useEffect(() => {
    const setGeoHash = () => {
      const currentGeoHash = localStorage.getItem("geohash");
      const localGeoHash = JSON.parse(currentGeoHash);
      if (localGeoHash) {
        const four = localGeoHash.four;
        const three = localGeoHash.three;
        meetingTime === 5
          ? setCurrentHash(four)
          : meetingTime === 10
          ? setCurrentHash(four)
          : setCurrentHash(three);
        //setHashThree(three);
        //setHashFour(four);
      } else if (!localGeoHash) {
        const geo = navigator.geolocation;
        if (!geo) {
          setError("Geolocation is not supported");
          return;
        }
        const watcher = geo.watchPosition(onChange, onError);
        return () => geo.clearWatch(watcher);
      }
    };

    setGeoHash();
  }, []);

  useEffect(() => {
    const setContext = () => {
      const currentGeoHash = localStorage.getItem("geohash");
      const localGeoHash = JSON.parse(currentGeoHash);
      if (localGeoHash) {
        const four = localGeoHash.four;
        const three = localGeoHash.three;
        meetingTime === 5
          ? setUserContext(four)
          : meetingTime === 10
          ? setUserContext(four)
          : setUserContext(three);
        //setHashThree(three);
        //setHashFour(four);
      }
    };
    setContext();
  }, [meetingTime]);
  /*
  useEffect(() => {
    const updateState = () => {
      console.log(meetingTime);
      const currentGeoHash = localStorage.getItem("geohash");
      const localGeoHash = JSON.parse(currentGeoHash);
      const four = localGeoHash.four;
      const three = localGeoHash.three;
      console.log(localGeoHash);
      meetingTime === 5
        ? setCurrentHash(three)
        : meetingTime === 10
        ? setCurrentHash(four)
        : setCurrentHash(three);
    };
    updateState();
  }, [meetingTime]);
*/
  const meetingTimeComputed = () => {
    const value = meetingTime;

    const hours = Math.floor(value / 60);
    const minutes = value - hours * 60;
    const formatted = [];
    if (hours > 0) {
      formatted.push(`${hours} ${hours > 1 ? "hours" : "hour"}`);
    }
    if (minutes > 0) {
      formatted.push(`${minutes} `);
    }
    return formatted.join(" ");
  };

  const stepperPlusClick = () => {
    const currentGeoHash = localStorage.getItem("geohash");
    const localGeoHash = JSON.parse(currentGeoHash);
    const four = localGeoHash.four;
    const three = localGeoHash.three;
    meetingTime > 10 ? setCurrentHash(three) : setCurrentHash(four);
    console.log(meetingTime);
  };

  const stepperMinusClick = () => {
    const currentGeoHash = localStorage.getItem("geohash");
    const localGeoHash = JSON.parse(currentGeoHash);
    const four = localGeoHash.four;
    const three = localGeoHash.three;
    meetingTime < 15 ? setCurrentHash(four) : setCurrentHash(three);
  };

  //console.log(`getLocation = ${getLocation}`);
  const onPageBeforeOut = () => {
    // Close opened sheets on page out
    f7.sheet.close();
  };

  return (
    <Page name="home" onPageBeforeOut={onPageBeforeOut}>
      {/* Top Navbar */}
      <Navbar sliding={false}>
        <NavTitle sliding></NavTitle>
      </Navbar>
      <Row>
        {" "}
        <Col style={{ padding: "20px" }}> </Col>
      </Row>
      <PageContent>
        {" "}
        <Row>
          <Col
            width="100"
            medium="50"
            style={{
              padding: "0px",
              border: "none",

              backgroundColor: "transparent",
            }}
          >
            <Card className="demo-facebook-card">
              <CardHeader className="no-border">
                {user ? (
                  <div className="demo-facebook-name">
                    welcome back {user.displayName}!
                  </div>
                ) : (
                  <div> ...</div>
                )}
              </CardHeader>
              <CardContent padding={false}>
                <img
                  className="chat-bubble-img"
                  src="https://i.imgur.com/t43a4BZ.png"
                  width="20%"
                />
              </CardContent>
              <CardFooter className="no-border">
                <Link sheetOpen=".demo-sheet-swipe-to-close">
                  Current Location
                </Link>
              </CardFooter>
            </Card>
          </Col>
          <Col width="100" medium="50"></Col>
        </Row>
        {/* Page content */}
        <Block>
          <Row>
            <Col
              width="100"
              medium="50"
              style={{
                padding: "50px",
              }}
            >
              <Button large raised fill href="/tabs/">
                Enter Chat Room
              </Button>
            </Col>
          </Row>
        </Block>
      </PageContent>

      <Sheet
        className="demo-sheet-swipe-to-close"
        style={{ height: "auto", "--f7-sheet-bg-color": "#fff" }}
        swipeToClose
        backdrop
      >
        <PageContent>
          <div className="display-flex padding justify-content-space-between align-items-center">
            <div style={{ fontSize: "18px" }}>
              <b>latitude:</b>
            </div>
            <div style={{ fontSize: "22px" }}>
              <b>{latitude}</b>
            </div>
          </div>

          <div className="display-flex padding justify-content-space-between align-items-center">
            <div style={{ fontSize: "18px" }}>
              <b>longitude:</b>
            </div>
            <div style={{ fontSize: "22px" }}>
              <b>{longitude}</b>
            </div>
          </div>
          <div className="display-flex padding justify-content-space-between align-items-center">
            <div style={{ fontSize: "18px" }}>
              <b>Current GeoHash: </b>
            </div>
            <div style={{ fontSize: "22px" }}>
              <b>{currentHash}</b>
            </div>
          </div>
          <List>
            <ListItem header="GeoLocation Radius" title={meetingTimeComputed()}>
              <Stepper
                className="mystepper"
                min={5}
                max={15}
                step={5}
                value={meetingTime}
                buttonsOnly={true}
                small
                fill
                raised
                slot="after"
                onStepperPlusClick={stepperPlusClick}
                onStepperMinusClick={stepperMinusClick}
                onStepperChange={setRadius}
              />
            </ListItem>
          </List>
        </PageContent>
      </Sheet>
    </Page>
  );
};

export default HomePage;
