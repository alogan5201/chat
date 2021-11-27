import { useState, useEffect } from "react";
import Geohash from "latlon-geohash";

export const usePosition = () => {
  const [position, setPosition] = useState({});
  const [error, setError] = useState(null);

  const onChange = ({ coords }) => {
    let lat = coords.latitude;
    let lng = coords.longitude;

    let fourGeohash = Geohash.encode(lat, lng, 4);
    let threeGeohash = Geohash.encode(lat, lng, 3);
    localStorage.setItem(
      "geohash",
      JSON.stringify({
        three: threeGeohash,
        four: fourGeohash,
      })
    );
    // threeGeohash

    localStorage.setItem("fourgeohash", JSON.stringify(fourGeohash));
    setPosition({
      latitude: coords.latitude,
      longitude: coords.longitude,
      fourgeohash: fourGeohash,
      threeGeohash: threeGeohash,
    });
  };
  const onError = (error) => {
    setError(error.message);
  };
  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      setError("Geolocation is not supported");
      return;
    }
    const watcher = geo.watchPosition(onChange, onError);
    return () => geo.clearWatch(watcher);
  }, []);
  return { ...position, error };
};
