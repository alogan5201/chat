import React, { useState, useEffect, useRef, useContext } from "react";
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
import { UserContext } from "../components/UserContext";
export default function MyChat(props) {
  //const { f7router, f7route } = props;
  //const userContext = f7route.params.id;
  const { userContext } = useContext(UserContext);
  console.log(`ChatComponent userContext = ${typeof userContext}`);

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
    if (userContext) {
      //console.log(typeof userContext);
    }
  };

  const [myUserList, setMyUserList] = useState([]);
  const [user1, setUser1] = useState("");
  const [userGeoHash, setUserGeoHash] = useState([]);

  useEffect(() => {
    f7ready(() => {
      const myHashQuery = userContext;
      // console.log(userContext);

      const usersRef = collection(firestore, "users");
      const q = query(
        usersRef,
        where("isOnline", "==", true),
        where("geoHash", "==", myHashQuery)
      );

      const myDataFetchFunction = async () => {
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const user1 = auth.currentUser.uid;
            console.log("chats snapshot render");
            let myUserList = [];
            snapshot.forEach((doc) => {
              myUserList.push(doc.data());
            });
            setMyUserList(myUserList);
            setUser1(user1);
          },
          (error) => {
            console.log(error);
          }
        );
        return () => unsubscribe();
      };
      return myDataFetchFunction();
    });
  }, []);

  return (
    <div>
      {userContext ? userContext : "No hash homie"}

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
    </div>
  );
}
