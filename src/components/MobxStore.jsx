import React from "react";

import { observer } from "mobx-react";
import { useProvider, useCreateStore } from "mobx-store-provider";
import AppStore from "../components/AppStore";
import UserDisplay from "../components/UserDisplay";

const MobxStore = () => {
  const appStore = useCreateStore(AppStore, { user: "Jonathan" });

  // Get the Provider for the AppStore
  const Provider = useProvider(AppStore);
  return (
    <Provider value={appStore}>
      <UserDisplay />
    </Provider>
  );
};

export default MobxStore;
