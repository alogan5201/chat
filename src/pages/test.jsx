import React, { useState, useCallback } from "react";
import {
  Page,
  Navbar,
  Subnavbar,
  Searchbar,
  Block,
  List,
  ListItem,
  theme,
} from "framework7-react";
import { firestore, auth } from "../services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Test() {
  const items = [];

  const [vlData, setVlData] = useState({
    items: [],
  });
  /*
  const addData = useCallback(
    (n) => {
      setCount((c) => c + n);
    },
    [setCount]
  );
  */
  const searchAll = (query, searchItems) => {
    const found = [];
    for (let i = 0; i < searchItems.length; i += 1) {
      if (
        searchItems[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
        query.trim() === ""
      )
        found.push(i);
    }
    return found; // return array with mathced indexes
  };

  const getUserList = async () => {
    let myUserList = [];
    const usersRef = collection(firestore, "users");
    const q = query(
      usersRef,
      where("isOnline", "==", true),
      where("geoHash", "==", "dn5b")
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      myUserList.push(doc.data());
    });
    console.log(myUserList);
    return myUserList;
  };
  const myUserList = getUserList();
  const renderExternal = (newData) => {
    setVlData({ ...newData });
  };

  renderExternal(myUserList);

  return (
    <Page className="test">
      <Navbar title="Virtual List" backLink="Back">
        <Subnavbar inner={false}>
          <Searchbar
            searchContainer=".virtual-list"
            searchItem="li"
            searchIn=".item-title"
            disableButton={!theme.aurora}
          />
        </Subnavbar>
      </Navbar>
      <Block>
        <p>
          Virtual List allows to render lists with huge amount of elements
          without loss of performance. And it is fully compatible with all
          Framework7 list components such as Search Bar, Infinite Scroll, Pull
          To Refresh, Swipeouts (swipe-to-delete) and Sortable.
        </p>
        <p>Here is the example of virtual list with 10 000 items:</p>
      </Block>
      <List className="searchbar-not-found">
        <ListItem title="Nothing found" />
      </List>
      <List
        className="searchbar-found"
        medialList
        virtualList
        virtualListParams={{
          items,
          searchAll,
          renderExternal,
          height: theme.ios ? 63 : theme.md ? 73 : 77,
        }}
      >
        <ul>
          {vlData.items.map((item) => (
            <ListItem
              key={doc.uid}
              mediaItem
              link="#"
              title={item.name}
              virtualListIndex={items.indexOf(item)}
            />
          ))}
        </ul>
      </List>
    </Page>
  );
}
