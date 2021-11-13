import React from "react";
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
} from "framework7-react";
import "./Chats.less";
import { contacts, chats } from "../data";
import DoubleTickIcon from "../components/DoubleTickIcon";
import { database, auth, firestore } from "../services/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { ref, getDatabase } from "firebase/database";

import { useList } from "react-firebase-hooks/database";

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
  });
  contactsSorted.forEach((myContact) => {
    groups[myContact.name[0].toUpperCase()].push(myContact);
  });
  console.log(groups);
  const [snapshots, loading, error] = useList(ref(database, "usersTable"));
  const user = auth.currentUser;

  snapshots.filter((snapshop) => {});
  var otherUsers = snapshots.filter(function (snapshot) {
    return snapshot.key !== user.uid;
  });
  const chatsRef = doc(firestore, "chats", "MyU9lVSaIWbf5uEYrKHV");
  async function getSnapData() {
    await updateDoc(chatsRef, {
      messages: arrayUnion({
        content: "this is a test",
        createdAt: Date.now(),
        uid: "usdjdjf",
      }),
    });
  }

  //console.log(otherUsers);
  return (
    <Page className="chats-page">
      <Navbar title="Chats" large transparent>
        <Link slot="left" loginScreenOpen="#my-login-screen">
          Login
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
      <ListIndex indexes={Object.keys(groups)} listEl=".contacts-list" />
      <List contactsList noChevron noHairlines>
        {/*CONTACT LIST------------------------------------------------ */}
        {Object.keys(groups).map((groupKey) => (
          <ListGroup key={groupKey}>
            <ListItem />
            {groups[groupKey].map((myContact) => (
              <ListItem
                key={myContact.name}
                link={`/chats/${myContact.id}/`}
                title={myContact.name}
                footer={myContact.status}
                popupClose
              >
                <img slot="media" src={`/avatars/${myContact.avatar}`} />
              </ListItem>
            ))}
          </ListGroup>
        ))}
      </List>
      <List noChevron noHairlines mediaList className="chats-list">
        {chatsFormatted.map((chat) => (
          <ListItem
            key={chat.userId}
            link={`/chats/${chat.userId}/`}
            title={chat.contact.name}
            after={chat.lastMessageDate}
            swipeout
          >
            <img
              slot="media"
              src={`/avatars/${chat.contact.avatar}`}
              loading="lazy"
              alt={chat.contact.name}
            />
            <span slot="text">
              {chat.lastMessageType === "sent" && <DoubleTickIcon />}

              {chat.lastMessageText}
            </span>
            <SwipeoutActions left>
              <SwipeoutButton
                close
                overswipe
                color="blue"
                onClick={swipeoutUnread}
              >
                <Icon f7="chat_bubble_fill" />
                <span>Unread</span>
              </SwipeoutButton>
              <SwipeoutButton close color="gray" onClick={swipeoutPin}>
                <Icon f7="pin_fill" />
                <span>Pin</span>
              </SwipeoutButton>
            </SwipeoutActions>
            <SwipeoutActions right>
              <SwipeoutButton close color="gray" onClick={swipeoutMore}>
                <Icon f7="ellipsis" />
                <span>More</span>
              </SwipeoutButton>
              <SwipeoutButton
                close
                overswipe
                color="light-blue"
                onClick={swipeoutArchive}
              >
                <Icon f7="archivebox_fill" />
                <span>Archive</span>
              </SwipeoutButton>
            </SwipeoutActions>
          </ListItem>
        ))}
      </List>

      <div>
        {error && <strong>Error: {error}</strong>}
        {loading && <span>List: Loading...</span>}
        {!loading && otherUsers && (
          <List noChevron noHairlines mediaList className="chats-list">
            <ul>
              UserList:{" "}
              {otherUsers.map((v) => (
                <ListItem
                  key={v.key}
                  title={`${v.val().fullName}`}
                  link={`/chats/${v.val().uid}/`}
                >
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
    </Page>
  );
}

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
