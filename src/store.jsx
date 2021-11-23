import create from "zustand";
import { devtools, persist } from "zustand/middleware";

let settingsStore = (set) => ({
  dark: false,
  toggleDarkMode: () => set((state) => ({ dark: !state.dark })),
});

let peopleStore = (set) => ({
  people: ["John Doe", "Jane Doe"],
  addPerson: (person) =>
    set((state) => ({ people: [...state.people, person] })),
});
let geoHashStore = (set) => ({
  currentGeoHash: [],
  addGeoHash: (geoHash) =>
    set((state) => ({ geoHash: [...state.geoHash, geoHash] })),
});

settingsStore = devtools(settingsStore);
settingsStore = persist(settingsStore, { name: "user_settings" });

peopleStore = devtools(peopleStore);
geoHashStore = devtools(geoHashStore);

export const useSettingsStore = create(settingsStore);
export const usePeopleStore = create(peopleStore);
export const useGeoHashStore = create(geoHashStore);
