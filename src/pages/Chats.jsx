import React, { useState, useEffect, useRef } from "react";
import {
  f7,
  List,
  ListGroup,
  ListItem,
  Navbar,
  Link,
  Page,
  SwipeoutActions,
  SwipeoutButton,
  Icon,
  ListIndex,
  Button,
  Popup,
  View,
  NavRight,
  Block,
} from "framework7-react";

import "./Chats.less";
import { contacts, chats } from "../data";
import DoubleTickIcon from "../components/DoubleTickIcon";
import OnlineIcon from "../components/OnlineIcon";
import { database, auth, firestore } from "../services/firebase";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

import { ref, getDatabase } from "firebase/database";

import { useList } from "react-firebase-hooks/database";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { deepCopy } from "@firebase/util";

export default function Chats(props) {
  const { f7router } = props;
  const swipeoutUnread = () => {
    f7.dialog.alert("Unread");
  };
  const swipeoutPin = () => {
    f7.dialog.alert("Pin");
  };
  const swipeoutMore = () => {
    f7.dialog.alert("More");
  };
  const swipeoutArchive = () => {
    f7.dialog.alert("Archive");
  };
  const onUserSelect = (user) => {
    console.log("start new chat with", user);
    setTimeout(() => {
      f7router.navigate(`/chats/${user.id}/`);
    }, 300);
  };
  const chatsFormatted = chats.map((chat) => {
    const contact = contacts.filter((contact) => contact.id === chat.userId)[0];
    //console.log("contact =");
    //console.log(contact);
    const lastMessage = chat.messages[chat.messages.length - 1];
    // console.log("lastMessage =");
    // console.log(lastMessage);
    return {
      ...chat,
      lastMessageText: lastMessage.text,
      lastMessageDate: Intl.DateTimeFormat("en", {
        month: "short",
        year: "numeric",
        day: "numeric",
      }).format(lastMessage.date),
      lastMessageType: lastMessage.type,
      contact,
    };
  });

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

  const user1 = auth.currentUser.uid;
  // console.log(auth.currentUser.uid);
  const usersRef = collection(firestore, "users");
  const q = query(usersRef, where("uid", "not-in", [user1]));
  const [onlineUsers, loading, error] = useCollectionData(q);

  const onPageBeforeRemove = () => {
    // Destroy popup when page removed
    console.log("beforeremove");
  };
  const onPageBeforeIn = () => {
    console.log("before init");
  };
  return (
    <Page className="chats-page" onPageBeforeRemove={onPageBeforeRemove}>
      <Navbar title="Chats" large transparent>
        <Link slot="left" loginScreenOpen="#my-login-screen">
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

      <List noChevron noHairlines mediaList className="chats-list">
        {error && <strong>Error: {error}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {onlineUsers && (
          <ul>
            {onlineUsers.map((doc) => (
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
        )}
      </List>
    </Page>
  );
}

const UserList = () => {
  const otherUsers = MyFunction();
  console.log(otherUsers);

  return (
    <div>
      {otherUsers && (
        <List noChevron noHairlines mediaList className="chats-list">
          <ul>
            UserList:{" "}
            {otherUsers.map((v) => (
              <ListItem key={v.id} title={v.name}>
                <img
                  slot="media"
                  src={v.avatar}
                  loading="lazy"
                  alt={v.name}
                  onClick={() => onUserSelect(v)}
                />
              </ListItem>
            ))}
          </ul>
        </List>
      )}
    </div>
  );
};

const DatabaseList = (props) => {
  const [snapshots, loading, error] = useList(ref(database, "usersTable"));
  const user = auth.currentUser;
  snapshots.filter((snapshop) => {});
  var otherUsers = snapshots.filter(function (snapshot) {
    return snapshot.key !== user.uid;
  });
  console.log(otherUsers);
  return (
    <div>
      {error && <strong>Error: {error}</strong>}
      {loading && <span>List: Loading...</span>}
      {!loading && otherUsers && (
        <List noChevron noHairlines mediaList className="chats-list">
          <ul>
            UserList:{" "}
            {otherUsers.map((v) => (
              <ListItem key={v.key} title={`${v.val().fullName}`}>
                <img
                  slot="media"
                  src={`${v.val().profile_picture}`}
                  loading="lazy"
                  alt={`${v.val().fullName}`}
                  onClick={() => onUserSelect(v)}
                />
              </ListItem>
            ))}
          </ul>
        </List>
      )}
    </div>
  );
};
