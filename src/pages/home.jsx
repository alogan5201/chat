import React, { useContext, useState } from "react";
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
} from "framework7-react";
import MobxStore from "../components/MobxStore";
const HomePage = () => {
  //const { userctx, setUser } = useContext(UserContext);

  //const [name, setName] = useLocalStorage("name", "");

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

      {/* Page content */}
      <MobxStore />
      <Block strong>
        <p>
          This is an example of tabs-layout application. The main point of such
          tabbed layout is that each tab contains independent view with its own
          routing and navigation.
        </p>

        <p>
          Each tab/view may have different layout, different navbar type
          (dynamic, fixed or static) or without navbar like this tab.
        </p>
      </Block>
      <BlockTitle>Navigation</BlockTitle>
      <List>
        <ListItem link="/mymessages/user/1/" title="My Messages" />
        <ListItem link="/test/" title="Test" />
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

function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue];
}

export default HomePage;
