import React, { useState, useEffect, useRef, useMemo } from "react";
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
import { useLocalStorage } from "../hooks/useLocalStorage";
/*
const getLocation = localStorage.getItem("userlocation");
console.log(`getLocation = ${getLocation}`);
*/

export default function Chats(props) {
  const { f7router, f7route } = props;

  const chatId = f7route.params.id;
  const onUserSelect = (user) => {
    //console.log("start new chat with", user);
    setTimeout(() => {
      f7router.navigate(`/messages/${user.id}/`);
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

  const onPageBeforeRemove = () => {
    // Destroy popup when page removed
    // console.log("beforeremove");
  };
  const onPageBeforeIn = () => {
    // console.log("before init");
    if (chatId) {
      //console.log(typeof chatId);
    }
  };

  const [myUserList, setMyUserList] = useState([]);
  const [user1, setUser1] = useState("");
  const [userLocation, setUserLocation] = useState(() => {
    // getting stored value
    const saved = localStorage.getItem("userlocation");
    const initialValue = saved;

    return initialValue || "";
  });
  useEffect(() => {
    f7ready(() => {
      console.log("chat page render");
    });
  }, []);
  const onPageInit = () => {
    const myHashQuery = chatId;
    // console.log(chatId);

    const usersRef = collection(firestore, "users");
    const q = query(
      usersRef,
      where("isOnline", "==", true),
      where("geoHash", "==", myHashQuery)
    );

    const getUserListOnce = async () => {
      const querySnapshot = await getDocs(q);
      let myUserList = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        myUserList.push(doc.data());
      });
      console.log(myUserList);
    };

    getUserListOnce();
  };

  //const myUserLIst = useMemo(() => computeLongestWord(data), [data]);
  return (
    <Page className="chats-page" onPageInit={onPageInit}>
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
        <Link href="/settings/">Settings</Link>
      </Toolbar>
      {chatId ? chatId : "No hash homie"}

      <List noChevron noHairlines mediaList className="chats-list">
        <ul>
          {myUserList
            .filter((allusers) => allusers.uid != user1)
            .map((doc) => (
              <ListItem
                key={doc.uid}
                link={`/messages/${doc.uid}/`}
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
