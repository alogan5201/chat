import React from "react";
import { observer } from "mobx-react";
import { useStore } from "mobx-store-provider";
import AppStore from "./AppStore";

function UserDisplay() {
  // Get access to the store
  const appStore = useStore(AppStore);
  return <div>{appStore.user}</div>;
}

// Wrap it with mobx-react observer(), so updates get rendered
export default observer(UserDisplay);
