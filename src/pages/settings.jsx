import React from "react";
import { Page, Navbar, List, ListItem } from "framework7-react";

export default () => (
  <Page name="settings">
    <Navbar title="Settings" backLink="Back" />
    <List>
      <ListItem title="Local Radius" smartSelect>
        <select name="radius" defaultValue="5 miles">
          <option value="5miles">5 miles</option>
          <option value="pineapple">Pineapple</option>
          <option value="pear">Pear</option>
          <option value="orange">Orange</option>
          <option value="melon">Melon</option>
          <option value="peach">Peach</option>
          <option value="banana">Banana</option>
        </select>
      </ListItem>
    </List>
  </Page>
);
