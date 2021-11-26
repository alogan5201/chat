import $ from "dom7";
import React, { useRef, useState, useEffect } from "react";
import {
  f7,
  Navbar,
  Link,
  Page,
  Messages,
  Message,
  Messagebar,
  f7ready,
} from "framework7-react";
import "./Messages.less";
import { firestore, auth } from "../services/firebase";
import {
  query,
  orderBy,
  collection,
  onSnapshot,
  limit,
  doc,
  where,
  arrayUnion,
  updateDoc,
  getDoc,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import DoubleTickIcon from "../components/DoubleTickIcon";
import { current } from "immer";

export default function MessagesPage(props) {
  const currentUser = auth.currentUser;

  const { f7route } = props;

  const userId = f7route.params.id;
  const user1 = currentUser.uid;
  const usersQuery = user1.concat(userId);
  //console.log(userId);
  //console.log(usersQuery);
  const firstUserConcat = user1.concat(userId);
  // console.log(`userId = ${userId}`);
  // console.log(`user1 = ${user1}`);
  // console.log(`firstUserConcat = ${firstUserConcat}`);
  const messagebarRef = useRef(null);
  const [myMessages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [chatName, setChatName] = useState("");
  const messageTime = (message) =>
    Intl.DateTimeFormat("en", { hour: "numeric", minute: "numeric" }).format(
      message.date
    );
  const isMessageFirst = (message) => {
    const messageIndex = myMessages.indexOf(message);
    const previousMessage = myMessages[messageIndex - 1];
    return !previousMessage || previousMessage.type !== message.type;
  };
  const isMessageLast = (message) => {
    const messageIndex = myMessages.indexOf(message);
    const nextMessage = myMessages[messageIndex + 1];
    return !nextMessage || nextMessage.type !== message.type;
  };

  const sendMessage = async () => {
    const user2 = f7route.params.id;
    const user1 = currentUser.uid;

    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    const docRef = doc(firestore, "chats", id);
    await updateDoc(docRef, {
      messages: arrayUnion({
        uid: currentUser.uid,
        createdAt: new Date(),
        content: messageText,
      }),
    });

    await myMessages.push({
      uid: currentUser.uid,
      createdAt: new Date(),
      content: messageText,
    });
    setMessageText("");
    setMessages([...myMessages]);

    setTimeout(() => {
      messagebarRef.current.f7Messagebar().focus();
    });
  };

  // Fix for iOS web app scroll body when
  const resizeTimeout = useRef(null);

  const onViewportResize = () => {
    $("html, body").css("height", `${visualViewport.height}px`);
    $("html, body").scrollTop(0);
  };

  const onMessagebarFocus = () => {
    const { device } = f7;
    if (!device.ios || device.cordova || device.capacitor) return;
    clearTimeout(resizeTimeout.current);
    visualViewport.addEventListener("resize", onViewportResize);
  };

  const onMessagebarBlur = () => {
    const { device } = f7;
    if (!device.ios || device.cordova || device.capacitor) return;
    resizeTimeout.current = setTimeout(() => {
      visualViewport.removeEventListener("resize", onViewportResize);
      $("html, body").css("height", "");
      $("html, body").scrollTop(0);
    }, 100);
  };
  const addChatSession = async () => {
    const user2 = f7route.params.id;
    const user1 = currentUser.uid;

    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    const docRef = doc(firestore, "chats", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return;
    } else {
      // doc.data() will be undefined in this case
      console.log("data does not exist");
      const docData = {
        createdAt: Timestamp.fromDate(new Date()),
        messages: [],
        users: [user1, user2],
      };

      await setDoc(doc(firestore, "chats", id), docData);
    }
    setChatName(userId);
  };
  // End of iOS web app fix
  useEffect(() => {
    f7ready(() => {
      const chatsRef = collection(firestore, "chats");
      const user2 = f7route.params.id;
      const user1 = currentUser.uid;

      const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
      console.log(`id = ${id}`);
      const q = query(chatsRef, where("users", "array-contains", user1));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          let myMessages = [];
          console.log("messages snapshot render");
          snapshot.forEach((doc) => {
            myMessages.push(doc.data().messages);
          });
          console.log(myMessages.length);
          if (myMessages.length == 0) {
            addChatSession();
          }
          setMessages(myMessages[0]);
        },
        (error) => {
          console.log(error);
        }
      );
      return () => unsubscribe();
    });
  }, []);

  return (
    <Page className="myMessages-page" noToolbar messagesContent>
      <Navbar className="myMessages-navbar" backLink backLinkShowText={false}>
        <Link slot="right" iconF7="videocam" />
        <Link slot="right" iconF7="phone" />
        <Link
          slot="title"
          href={`/profile/${userId}/`}
          className="title-profile-link"
        >
          <div>
            <div className="subtitle">online</div>
          </div>
        </Link>
      </Navbar>
      <Messagebar
        ref={messagebarRef}
        placeholder=""
        value={messageText}
        onInput={(e) => setMessageText(e.target.value)}
        onFocus={onMessagebarFocus}
        onBlur={onMessagebarBlur}
      >
        <Link slot="inner-start" iconF7="plus" />
        <Link
          className="messagebar-sticker-link"
          slot="after-area"
          iconF7="sticker"
        />
        {messageText.trim().length ? (
          <Link
            slot="inner-end"
            className="messagebar-send-link"
            iconF7="paperplane_fill"
            onClick={sendMessage}
          />
        ) : (
          <>
            <Link slot="inner-end" href="/camera/" iconF7="camera" />
            <Link slot="inner-end" iconF7="mic" />
          </>
        )}
      </Messagebar>
      <Messages>
        {myMessages &&
          myMessages.map((message, index) => (
            <Message
              key={index}
              data-key={index}
              first={isMessageFirst(message)}
              last={isMessageLast(message)}
              tail={isMessageLast(message)}
              type={message.uid === currentUser.uid ? "sent" : "received"}
              text={message.content}
              className="message-appear-from-bottom"
            >
              <span slot="text-footer">
                {message.type === "sent" && <DoubleTickIcon />}
                {messageTime(message)}
              </span>
            </Message>
          ))}
      </Messages>
    </Page>
  );
}
