import { createStore } from "framework7/lite";

const store = createStore({
  state: {
    users: [],
  },
  actions: {
    getUsers({ state }) {
      // ...
    },
  },
  getters: {
    users({ state }) {
      return state.users;
    },
  },
});

export default store;
