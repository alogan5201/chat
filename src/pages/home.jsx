import React, { useContext, useState, useEffect, useCallback } from "react";
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
const HomePage = () => {
  const [coords, setCoords] = useState([]);
  const [meetingTime, setMeetingTime] = useState(5);
  const [hash, setHash] = useState("");
  const myQuery = "?geohash=bar";

  useEffect(() => {
    const getUserLocation = () => {
      const onSuccess = async (location) => {
        let lat = location.coords.latitude;
        let lng = location.coords.longitude;
        // 33.8141499 -84.4388509
        const geohash = Geohash.encode(lat, lng, 4);
        console.log(lat, lng);
        const uid = auth.currentUser.uid;
        const userRef = doc(firestore, "users", uid);
        await updateDoc(userRef, {
          geoHash: geohash,
        });
        setCoords([lat, lng]);
        setHash(geohash);
        console.log("onSuccess");
      };

      const onError = (error) => {
        console.log(error);
      };
      if (!("geolocation" in navigator)) {
        onError({
          code: 0,
          message: "Geolocation not supported",
        });
      }

      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    };

    (async () => {
      const data = await HaversineGeolocation.isGeolocationAvailable();
      const currentPoint = {
        latitude: data.coords.latitude,
        longitude: data.coords.longitude,
        accuracy: data.coords.accuracy,
      };
      if (data) {
        let lat = currentPoint.latitude;
        let lng = currentPoint.longitude;

        const twelveMileRadius = Geohash.encode(lat, lng, 4);
        const ninetyMileRadius = Geohash.encode(lat, lng, 3);
        // console.log(auth.currentUser);
        //console.log(lat, lng);

        return meetingTime == 15
          ? setHash(ninetyMileRadius)
          : setHash(twelveMileRadius);
        /**
            if (meetingTime == 15) {
          setHash(ninetyMileRadius);
        } else if (15 > meetingTime) {
          setHash(twelveMileRadius);
        }
         */
      } else {
        getUserLocation();
        return;
      }
    })();
  }, [meetingTime]);

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
      {/* Toolbar     <Link href={`/chats/${hash}/`}>Chat</Link>      */}
      <Toolbar bottom>
        <Link>Left Link</Link>
        <Link href={`/chats/${hash}/`}>Chat</Link>
      </Toolbar>
      <div>coordinates: {coords}</div>
      <div>geoHash: {hash}</div>
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
            onStepperChange={setMeetingTime}
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
        <ListItem link="/mymessages/user/1/" title="My Messages" />
        <ListItem link={`/chats/?geohash=${hash}`} title="TestPage" />
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
