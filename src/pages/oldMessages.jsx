import $ from "dom7";
import React, { useRef, useState } from "react";
import {
  f7,
  Navbar,
  Link,
  Page,
  Messages,
  Message,
  Messagebar,
} from "framework7-react";
import "./Messages.less";
import { chats, contacts } from "../data";
import DoubleTickIcon from "../components/DoubleTickIcon";

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <button type="submit" disabled={!formValue}>
          🕊️
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          src={
            photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
          }
        />
        <p>{text}</p>
      </div>
    </>
  );
}

export default function MessagesPage(props) {
  const { f7route } = props;
  const userId = parseInt(f7route.params.id, 10);
  console.log(`ChatUserTargetID = ${userId}`);
  const messagesData = chats.filter((chat) => chat.userId === userId)[0] || {
    messages: [],
  };

  console.log(messagesData);

  const contact = contacts.filter((contact) => contact.id === userId)[0];

  console.log(contact);

  const messagebarRef = useRef(null);
  const [messages, setMessages] = useState([...messagesData.messages]);
  const [messageText, setMessageText] = useState("");

  const messageTime = (message) =>
    Intl.DateTimeFormat("en", { hour: "numeric", minute: "numeric" }).format(
      message.date
    );
  const isMessageFirst = (message) => {
    const messageIndex = messages.indexOf(message);
    const previousMessage = messages[messageIndex - 1];
    return !previousMessage || previousMessage.type !== message.type;
  };
  const isMessageLast = (message) => {
    const messageIndex = messages.indexOf(message);
    const nextMessage = messages[messageIndex + 1];
    return !nextMessage || nextMessage.type !== message.type;
  };

  const sendMessage = () => {
    messages.push({
      text: messageText,
      date: new Date(),
      type: "sent",
    });
    setMessageText("");
    setMessages([...messages]);
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

  return (
    <Page className="messages-page" noToolbar messagesContent>
      <Navbar className="messages-navbar" backLink backLinkShowText={false}>
        <Link slot="right" iconF7="videocam" />
        <Link slot="right" iconF7="phone" />
        <Link
          slot="title"
          href={`/profile/${userId}/`}
          className="title-profile-link"
        >
          <img src={`/avatars/${contact.avatar}`} loading="lazy" />
          <div>
            <div>{contact.name}</div>
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
        {messages.map((message, index) => (
          <Message
            key={index}
            data-key={index}
            first={isMessageFirst(message)}
            last={isMessageLast(message)}
            tail={isMessageLast(message)}
            type={message.type}
            text={message.text}
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
