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
} from "firebase/firestore";
import DoubleTickIcon from "../components/DoubleTickIcon";
import { current } from "immer";

export default function MessagesPage(props) {
  const currentUser = auth.currentUser;

  const chats = [
    {
      userId: 1,
      myMessages: [
        {
          text: "Hey Mark! How are you doing?",
          type: "sent",
          date: new Date().getTime() - 2 * 60 * 60 * 1000,
        },
        {
          text: "Huge Facebook update is in the progress!",
          type: "received",
          date: new Date().getTime() - 1 * 60 * 60 * 1000,
        },
        {
          text: "Congrats! 🎉",
          type: "sent",
          date: new Date().getTime() - 0.5 * 60 * 60 * 1000,
        },
      ],
    },
  ];
  const contacts = [
    {
      id: 1,
      avatar: "mark-zuckerberg.jpg",
      name: "Mark Zuckerberg",
      status: "Life is good",
    },
  ];

  const { f7route } = props;

  const userId = f7route.params.id;
  const user1 = currentUser.uid;
  const usersQuery = user1.concat(userId);
  // console.log(usersQuery);
  //console.log(userId);
  const messagesData = chats.filter((chat) => chat.userId === userId)[0] || {
    myMessages: [],
  };
  const myessagesData = chats.filter((chat) => chat.userId === userId)[0] || {
    myMessages: [],
  };

  const contact = contacts.filter((contact) => contact.id === userId)[0];

  const messagebarRef = useRef(null);
  const [myMessages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

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
    const docRef = doc(firestore, "chats", "MyU9lVSaIWbf5uEYrKHV");
    await updateDoc(docRef, {
      messages: arrayUnion({
        uid: currentUser.uid,
        createdAt: new Date(),
        content: messageText,
      }),
    });

    myMessages.push({
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

  // End of iOS web app fix
  useEffect(() => {
    //const usersQuery = user1.concat(user2);
    f7ready(() => {
      const chatsRef = collection(firestore, "chats");
      const q = query(chatsRef, where("users", "array-contains", usersQuery));

      const unsub = onSnapshot(q, (querySnapshot) => {
        let myMessages = [];

        querySnapshot.forEach((doc) => {
          myMessages.push(doc.data().messages);
        });
        setMessages(myMessages[0]);
      });
      return () => unsub();
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
        {myMessages.map((message, index) => (
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
