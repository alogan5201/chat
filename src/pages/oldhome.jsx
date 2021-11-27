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

const HomePage = () => {
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

  return (
    <Page name="home">
      {/* Top Navbar */}
      <Navbar large sliding={false}>
        <NavLeft>
          <Link
            iconIos="f7:menu"
            iconAurora="f7:menu"
            iconMd="material:menu"
            panelOpen="left"
          />
        </NavLeft>
        <NavTitle sliding>My App</NavTitle>
        <NavRight>
          <Link
            iconIos="f7:menu"
            iconAurora="f7:menu"
            iconMd="material:menu"
            panelOpen="right"
          />
        </NavRight>
        <NavTitleLarge>My App</NavTitleLarge>
      </Navbar>
      {/* Toolbar           */}
      <Toolbar bottom>
        <Link>Left Link</Link>
        <Link href="/tabs/">Chat</Link>
      </Toolbar>
      <div>
        <div>Current Hash: {currentHash} </div>
        latitude: {latitude}
        <br />
        longitude: {longitude}
        <br />
      </div>
      {/*    onStepperPlusClick={stepperPlusClick}
              onStepperMinusClick={stepperMinusClick}*/}
      <BlockTitle>Custom value format</BlockTitle>
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
      {/* Page content */}
      <Block strong>
        <Row>
          <Col width="50">
            <Button fill raised>
              Testbtn 1
            </Button>
          </Col>
          <Col width="50">
            <Button fill raised>
              Testbtn 2
            </Button>
          </Col>
        </Row>
      </Block>

      <BlockTitle>Navigation</BlockTitle>
      <List>
        <ListItem link="/tabs/" title="Tabs" />
        <ListItem link="/mymessages/user/1/" title="My Messages" />
        <ListItem link="/test/" title="TestPage" />
        <ListItem link="/catalog/" title="Catalog" />
        <ListItem link="/about/" title="About" />
        <ListItem link="/form/" title="Form" />
      </List>

      <BlockTitle>Modals</BlockTitle>
      <Block strong>
        <Row>
          <Col width="50">
            <Button fill raised popupOpen="#my-popup">
              Popup
            </Button>
          </Col>
          <Col width="50">
            <Button fill raised loginScreenOpen="#my-login-screen">
              Login Screen
            </Button>
          </Col>
        </Row>
      </Block>

      <BlockTitle>Panels</BlockTitle>
      <Block strong>
        <Row>
          <Col width="50">
            <Button fill raised panelOpen="left">
              Left Panel
            </Button>
          </Col>
          <Col width="50">
            <Button fill raised panelOpen="right">
              Right Panel
            </Button>
          </Col>
        </Row>
      </Block>

      <List>
        <ListItem
          title="Dynamic (Component) Route"
          link="/dynamic-route/blog/45/post/125/?foo=bar#about"
        />
        <ListItem
          title="Default Route (404)"
          link="/load-something-that-doesnt-exist/"
        />
        <ListItem
          title="Request Data & Load"
          link="/request-and-load/user/123456/"
        />
      </List>
    </Page>
  );
};

export default HomePage;
