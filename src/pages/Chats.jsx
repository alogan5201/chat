import React, { useState, useEffect, useRef } from "react";
import {
  f7,
  List,
  ListItem,
  Navbar,
  Link,
  Page,
  f7ready,
  Toolbar,
} from "framework7-react";

import "./Chats.less";
import { contacts, chats } from "../data";

import OnlineIcon from "../components/OnlineIcon";
import { auth, firestore, signOutWithGoogle } from "../services/firebase";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

import { ref, getDatabase } from "firebase/database";

import { useList } from "react-firebase-hooks/database";

import { deepCopy } from "@firebase/util";

export default function Chats(props) {
  const { f7router, f7route } = props;

  const onUserSelect = (user) => {
    //console.log("start new chat with", user);
    setTimeout(() => {
      f7router.navigate(`/chats/${user.id}/`);
    }, 300);
  };

  const myContacts = [
    {
      id: 7,
      avatar: "abraham-burton.jpg",
      name: "Abraham Burton",
      status: "Hey there! I am using WhatsApp",
    },
  ];
  const contactsSorted = [...myContacts].sort((a, b) =>
    b.name > a.name ? -1 : 1
  );

  const groups = {};
  contactsSorted.forEach(({ name }) => {
    const key = name[0].toUpperCase();
    if (!groups[key]) groups[key] = [];
    firestore;
  });

  // console.log(auth.currentUser.uid);
  // where("uid", "not-in", [user1])

  const usersRef = collection(firestore, "users");
  const q = query(
    usersRef,
    where("isOnline", "==", true),
    where("geoHash", "==", "dn5b")
  );

  const onPageBeforeRemove = () => {
    // Destroy popup when page removed
    // console.log("beforeremove");
  };
  const onPageBeforeIn = () => {
    // console.log("before init");
    if (f7route.query.geohash) {
      //console.log(typeof f7route.query.geohash);
    }
  };

  const [myUserList, setMyUserList] = useState([]);
  const [user1, setUser1] = useState("");

  useEffect(() => {
    f7ready(() => {
      if (f7route.query.geohash) {
        const myHashQuery = f7route.query.geohash;
        // console.log(f7route.query.geohash);

        const usersRef = collection(firestore, "users");
        const q = query(
          usersRef,
          where("isOnline", "==", true),
          where("geoHash", "==", myHashQuery)
        );
        const unsub = onSnapshot(q, (querySnapshot) => {
          let myUserList = [];
          const user1 = auth.currentUser.uid;
          //  console.log(querySnapshot);
          querySnapshot.forEach((doc) => {
            myUserList.push(doc.data());
          });

          setMyUserList(myUserList);
          setUser1(user1);
        });
        return () => unsub();
      }
    });
  }, []);
  const onPageInit = () => {
    f7ready(() => {
      console.log(`f7route.query.geohash = ${f7route.query.geohash}`);
    });
  };
  return (
    <Page
      className="chats-page"
      onPageBeforeRemove={onPageBeforeRemove}
      onPageBeforeIn={onPageBeforeIn}
      onPageInit={onPageInit}
    >
      <Navbar title="Chats" large transparent>
        <Link slot="left" onClick={async () => signOutWithGoogle()}>
          Logout
        </Link>
        <Link
          slot="right"
          iconF7="square_pencil"
          href="/contacts/"
          routeProps={{
            modalTitle: "New Chat",
            onUserSelect,
          }}
        />
      </Navbar>
      <Toolbar bottom>
        <Link href="/" animate={false}>
          Home
        </Link>
        <Link>Blank</Link>
      </Toolbar>
      {f7route.query.geohash ? f7route.query.geohash : "No hash homie"}

      <List noChevron noHairlines mediaList className="chats-list">
        <ul>
          {myUserList
            .filter((allusers) => allusers.uid != user1)
            .map((doc) => (
              <ListItem
                key={doc.uid}
                link={`/chats/${doc.uid}/`}
                title={doc.name}
                swipeout
              >
                <img
                  slot="media"
                  src={doc.avatar || "/avatars/person-circle.svg"}
                />

                <span slot="text">{<OnlineIcon />}</span>
              </ListItem>
            ))}
        </ul>
      </List>
    </Page>
  );
}
